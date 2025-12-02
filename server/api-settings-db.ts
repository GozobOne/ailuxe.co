import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { apiSettings, InsertApiSetting } from "../drizzle/schema";

/**
 * API Settings Database Operations
 * Handles secure storage and retrieval of integration credentials
 */

/**
 * Get API setting by key
 */
export async function getApiSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(apiSettings)
      .where(eq(apiSettings.key, key))
      .limit(1);

    return result.length > 0 ? result[0].value : null;
  } catch (error) {
    console.error(`[API Settings] Error getting setting ${key}:`, error);
    return null;
  }
}

/**
 * Set API setting (upsert)
 */
export async function setApiSetting(
  key: string,
  value: string,
  category: "whatsapp" | "google" | "openrouter" | "stripe" | "lemon_squeezy" | "baileys" | "general",
  description?: string,
  required: boolean = false,
  updatedBy?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Check if setting exists
    const existing = await db
      .select()
      .from(apiSettings)
      .where(eq(apiSettings.key, key))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await db
        .update(apiSettings)
        .set({
          value,
          category,
          description,
          required: required ? 1 : 0,
          updatedBy,
          updatedAt: new Date(),
        })
        .where(eq(apiSettings.key, key));
    } else {
      // Insert new
      await db.insert(apiSettings).values({
        key,
        value,
        category,
        description,
        required: required ? 1 : 0,
        updatedBy,
      });
    }

    console.log(`[API Settings] Setting ${key} updated successfully`);
    return true;
  } catch (error) {
    console.error(`[API Settings] Error setting ${key}:`, error);
    return false;
  }
}

/**
 * Get all settings for a category
 */
export async function getApiSettingsByCategory(
  category: string
): Promise<Record<string, string>> {
  const db = await getDb();
  if (!db) return {};

  try {
    const results = await db
      .select()
      .from(apiSettings)
      .where(eq(apiSettings.category, category as any));

    const settings: Record<string, string> = {};
    for (const result of results) {
      settings[result.key] = result.value;
    }

    return settings;
  } catch (error) {
    console.error(`[API Settings] Error getting category ${category}:`, error);
    return {};
  }
}

/**
 * Delete API setting
 */
export async function deleteApiSetting(key: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(apiSettings).where(eq(apiSettings.key, key));
    console.log(`[API Settings] Setting ${key} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`[API Settings] Error deleting ${key}:`, error);
    return false;
  }
}

/**
 * Get WhatsApp Business API credentials
 */
export async function getWhatsAppCredentials(): Promise<{
  phoneNumberId: string | null;
  accessToken: string | null;
}> {
  const phoneNumberId = await getApiSetting("whatsapp_phone_number_id");
  const accessToken = await getApiSetting("whatsapp_access_token");

  return {
    phoneNumberId,
    accessToken,
  };
}

/**
 * Get Google OAuth credentials
 */
export async function getGoogleCredentials(): Promise<{
  clientId: string | null;
  clientSecret: string | null;
}> {
  const clientId = await getApiSetting("google_client_id");
  const clientSecret = await getApiSetting("google_client_secret");

  return {
    clientId,
    clientSecret,
  };
}

/**
 * Get OpenRouter API key
 */
export async function getOpenRouterApiKey(): Promise<string | null> {
  return await getApiSetting("openrouter_api_key");
}
