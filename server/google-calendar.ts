import { google } from "googleapis";
import { Request, Response } from "express";
import { getDb } from "./db";
import { apiSettings, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Google Calendar Integration
 * Handles OAuth flow and calendar operations
 */

interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}

/**
 * Get API setting value from database
 */
async function getApiSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    console.error("[Google] Database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(apiSettings)
      .where(eq(apiSettings.key, key))
      .limit(1);

    return result.length > 0 ? result[0].value : null;
  } catch (error) {
    console.error(`[Google] Error fetching API setting ${key}:`, error);
    return null;
  }
}

/**
 * Get OAuth2 client with credentials from database
 */
async function getOAuth2Client() {
  const clientId = await getApiSetting("google_client_id");
  const clientSecret = await getApiSetting("google_client_secret");

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials not configured");
  }

  const redirectUri = `${process.env.VITE_APP_URL || "http://localhost:3000"}/api/auth/google/callback`;

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generate Google OAuth URL
 */
export async function getGoogleAuthUrl(userId: number): Promise<string> {
  try {
    const oauth2Client = await getOAuth2Client();

    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: userId.toString(), // Pass userId in state for callback
      prompt: "consent", // Force consent to get refresh token
    });

    return url;
  } catch (error) {
    console.error("[Google] Error generating auth URL:", error);
    throw error;
  }
}

/**
 * Handle OAuth callback
 */
export async function handleGoogleCallback(req: Request, res: Response) {
  try {
    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).send("Missing authorization code");
    }

    if (!state || typeof state !== "string") {
      return res.status(400).send("Missing state parameter");
    }

    const userId = parseInt(state, 10);
    if (isNaN(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    const oauth2Client = await getOAuth2Client();

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in database (user-specific)
    await storeUserTokens(userId, tokens as GoogleTokens);

    console.log(`[Google] OAuth successful for user ${userId}`);

    // Redirect to success page
    return res.redirect("/baileys-connect?google_connected=true");
  } catch (error) {
    console.error("[Google] OAuth callback error:", error);
    return res.status(500).send("OAuth failed");
  }
}

/**
 * Store user's Google tokens in oauthTokens table
 * TODO: Encrypt tokens before storage
 */
async function storeUserTokens(userId: number, tokens: GoogleTokens) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const { oauthTokens } = await import("../drizzle/schema");
    const { and } = await import("drizzle-orm");

    // Check if token already exists
    const existing = await db
      .select()
      .from(oauthTokens)
      .where(and(eq(oauthTokens.userId, userId), eq(oauthTokens.provider, "google")))
      .limit(1);

    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

    if (existing.length > 0) {
      // Update existing token
      await db
        .update(oauthTokens)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || existing[0].refreshToken,
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(oauthTokens.id, existing[0].id));
    } else {
      // Insert new token
      await db.insert(oauthTokens).values({
        userId,
        provider: "google",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt,
        scope: "https://www.googleapis.com/auth/calendar",
      });
    }

    console.log(`[Google] Tokens stored for user ${userId}`);
  } catch (error) {
    console.error(`[Google] Error storing tokens for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get user's Google tokens from oauthTokens table
 */
async function getUserTokens(userId: number): Promise<GoogleTokens | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  try {
    const { oauthTokens } = await import("../drizzle/schema");
    const { and } = await import("drizzle-orm");

    const result = await db
      .select()
      .from(oauthTokens)
      .where(and(eq(oauthTokens.userId, userId), eq(oauthTokens.provider, "google")))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const token = result[0];
    return {
      access_token: token.accessToken,
      refresh_token: token.refreshToken || undefined,
      expiry_date: token.expiresAt ? token.expiresAt.getTime() : undefined,
    };
  } catch (error) {
    console.error(`[Google] Error fetching tokens for user ${userId}:`, error);
    return null;
  }
}

/**
 * Get authenticated calendar client for user
 */
async function getCalendarClient(userId: number) {
  const oauth2Client = await getOAuth2Client();
  const tokens = await getUserTokens(userId);

  if (!tokens) {
    throw new Error("User not authenticated with Google");
  }

  oauth2Client.setCredentials(tokens);

  // Check if token is expired and refresh if needed
  if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await storeUserTokens(userId, credentials as GoogleTokens);
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error(`[Google] Token refresh failed for user ${userId}:`, error);
      throw new Error("Token refresh failed - please re-authenticate");
    }
  }

  return google.calendar({ version: "v3", auth: oauth2Client });
}

/**
 * Create calendar event
 */
export async function createCalendarEvent(
  userId: number,
  event: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone?: string };
    end: { dateTime: string; timeZone?: string };
    attendees?: Array<{ email: string }>;
  }
) {
  try {
    const calendar = await getCalendarClient(userId);

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    console.log(`[Google] Event created for user ${userId}:`, response.data.id);
    return response.data;
  } catch (error) {
    console.error(`[Google] Error creating event for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Check if time slot is available
 */
export async function checkAvailability(
  userId: number,
  start: string,
  end: string
): Promise<boolean> {
  try {
    const calendar = await getCalendarClient(userId);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: start,
      timeMax: end,
      singleEvents: true,
    });

    // If no events found, slot is available
    return (response.data.items?.length || 0) === 0;
  } catch (error) {
    console.error(`[Google] Error checking availability for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(userId: number, maxResults: number = 10) {
  try {
    const calendar = await getCalendarClient(userId);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  } catch (error) {
    console.error(`[Google] Error fetching events for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Delete calendar event
 */
export async function deleteCalendarEvent(userId: number, eventId: string) {
  try {
    const calendar = await getCalendarClient(userId);

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    console.log(`[Google] Event deleted for user ${userId}:`, eventId);
    return true;
  } catch (error) {
    console.error(`[Google] Error deleting event for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get Google Calendar connection status for user
 */
export async function getConnectionStatus(userId: number): Promise<{
  connected: boolean;
  email?: string;
  expiresAt?: Date | null;
}> {
  try {
    const tokens = await getUserTokens(userId);
    
    if (!tokens) {
      return { connected: false };
    }

    // Try to get calendar info to verify the token works
    try {
      const calendar = await getCalendarClient(userId);
      const response = await calendar.calendarList.get({ calendarId: "primary" });
      
      return {
        connected: true,
        email: response.data.id || undefined,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      };
    } catch (error) {
      // Token exists but might be invalid
      console.error(`[Google] Token validation failed for user ${userId}:`, error);
      return { connected: false };
    }
  } catch (error) {
    console.error(`[Google] Error checking connection status for user ${userId}:`, error);
    return { connected: false };
  }
}
