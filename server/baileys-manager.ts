import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto,
  WAMessage,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as fs from "fs";
import * as path from "path";
import QRCode from "qrcode";

/**
 * Baileys WhatsApp Manager
 * Handles QR code generation and WhatsApp Web connections
 * Allows users to connect their own WhatsApp numbers without official API
 */

interface BaileysSession {
  socket: WASocket | null;
  qr: string | null;
  status: "disconnected" | "connecting" | "connected" | "qr_ready";
  userId: number;
  sessionId: string;
}

// Active sessions map (userId -> session)
const activeSessions = new Map<number, BaileysSession>();

// Session storage path (configurable via API settings)
const SESSION_BASE_PATH = process.env.BAILEYS_SESSION_PATH || "/tmp/baileys-sessions";

// Ensure session directory exists
if (!fs.existsSync(SESSION_BASE_PATH)) {
  fs.mkdirSync(SESSION_BASE_PATH, { recursive: true });
}

/**
 * Get session path for a user
 */
function getSessionPath(userId: number): string {
  return path.join(SESSION_BASE_PATH, `user_${userId}`);
}

/**
 * Initialize Baileys connection for a user
 * Returns QR code for scanning
 */
export async function initializeBaileysConnection(userId: number): Promise<{
  success: boolean;
  qr?: string;
  error?: string;
  status: string;
}> {
  try {
    // Check if session already exists
    const existingSession = activeSessions.get(userId);
    if (existingSession?.status === "connected") {
      return {
        success: true,
        status: "already_connected",
      };
    }

    // Create session directory
    const sessionPath = getSessionPath(userId);
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true });
    }

    // Load auth state
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    // Create session object
    const session: BaileysSession = {
      socket: null,
      qr: null,
      status: "connecting",
      userId,
      sessionId: `session_${userId}_${Date.now()}`,
    };

    // Create WhatsApp socket
    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false, // We'll handle QR display in UI
      defaultQueryTimeoutMs: undefined,
    });

    session.socket = socket;
    activeSessions.set(userId, session);

    // Handle connection updates
    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      // QR code received
      if (qr) {
        // Convert QR string to data URL for easy display
        try {
          const qrDataUrl = await QRCode.toDataURL(qr);
          session.qr = qrDataUrl;
          session.status = "qr_ready";
          console.log(`[Baileys] QR code ready for user ${userId}`);
        } catch (error) {
          console.error(`[Baileys] QR code generation error:`, error);
          session.qr = qr; // Fallback to raw string
          session.status = "qr_ready";
        }
      }

      // Connection opened
      if (connection === "open") {
        session.status = "connected";
        session.qr = null;
        console.log(`[Baileys] Connected for user ${userId}`);
      }

      // Connection closed
      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

        console.log(
          `[Baileys] Connection closed for user ${userId}, reconnect:`,
          shouldReconnect
        );

        if (shouldReconnect) {
          // Reconnect automatically
          await initializeBaileysConnection(userId);
        } else {
          // Logged out - clear session
          session.status = "disconnected";
          session.socket = null;
          session.qr = null;
          activeSessions.delete(userId);

          // Delete session files
          if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
          }
        }
      }
    });

    // Handle credentials update
    socket.ev.on("creds.update", saveCreds);

    // Handle incoming messages
    socket.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type === "notify") {
        for (const message of messages) {
          await handleIncomingMessage(userId, message);
        }
      }
    });

    // Wait for QR or connection (max 10 seconds)
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), 10000);

      const checkStatus = setInterval(() => {
        if (session.qr || session.status === "connected") {
          clearTimeout(timeout);
          clearInterval(checkStatus);
          resolve();
        }
      }, 100);
    });

    return {
      success: true,
      qr: session.qr || undefined,
      status: session.status,
    };
  } catch (error) {
    console.error(`[Baileys] Initialization error for user ${userId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      status: "error",
    };
  }
}

/**
 * Get current session status and QR code
 */
export function getBaileysStatus(userId: number): {
  status: string;
  qr?: string;
  connected: boolean;
} {
  const session = activeSessions.get(userId);

  if (!session) {
    return {
      status: "disconnected",
      connected: false,
    };
  }

  return {
    status: session.status,
    qr: session.qr || undefined,
    connected: session.status === "connected",
  };
}

/**
 * Disconnect Baileys session
 */
export async function disconnectBaileys(userId: number): Promise<boolean> {
  const session = activeSessions.get(userId);

  if (!session || !session.socket) {
    return false;
  }

  try {
    await session.socket.logout();
    session.socket = null;
    session.status = "disconnected";
    activeSessions.delete(userId);

    // Delete session files
    const sessionPath = getSessionPath(userId);
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    console.log(`[Baileys] Disconnected user ${userId}`);
    return true;
  } catch (error) {
    console.error(`[Baileys] Disconnect error for user ${userId}:`, error);
    return false;
  }
}

/**
 * Send message via Baileys
 */
export async function sendBaileysMessage(
  userId: number,
  to: string,
  message: string
): Promise<boolean> {
  const session = activeSessions.get(userId);

  if (!session || !session.socket || session.status !== "connected") {
    console.error(`[Baileys] Cannot send message - user ${userId} not connected`);
    return false;
  }

  try {
    // Format phone number (ensure it has @s.whatsapp.net suffix)
    const jid = to.includes("@") ? to : `${to}@s.whatsapp.net`;

    await session.socket.sendMessage(jid, { text: message });
    console.log(`[Baileys] Message sent to ${to} from user ${userId}`);
    return true;
  } catch (error) {
    console.error(`[Baileys] Send message error for user ${userId}:`, error);
    return false;
  }
}

/**
 * Handle incoming message
 * TODO: Integrate with AI persona and response generation
 */
async function handleIncomingMessage(userId: number, message: WAMessage) {
  try {
    // Skip if message is from self
    if (message.key.fromMe) {
      return;
    }

    const from = message.key.remoteJid || "";
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

    if (!text) {
      console.log(`[Baileys] Non-text message received for user ${userId}`);
      return;
    }

    console.log(`[Baileys] Message from ${from} to user ${userId}: ${text}`);

    // Auto-add unknown contact
    await autoAddUnknownContact(userId, from, "whatsapp");

    // Log incoming message
    await logMessage(userId, "whatsapp", "inbound", text, from);

    // Fetch user's persona configuration
    const persona = await getUserPersona(userId);
    
    // Generate AI response using persona tone
    const aiResponse = await generateAIResponse(text, persona);
    
    if (aiResponse) {
      // Send response via Baileys
      const sent = await sendBaileysMessage(userId, from, aiResponse);
      
      if (sent) {
        // Log outbound message
        await logMessage(userId, "whatsapp", "outbound", aiResponse, from);
        console.log(`[Baileys] AI response sent to ${from}`);
      }
    }
  } catch (error) {
    console.error(`[Baileys] Message handling error for user ${userId}:`, error);
  }
}

/**
 * Get all active sessions (for admin monitoring)
 */
export function getActiveSessions(): Array<{
  userId: number;
  status: string;
  sessionId: string;
}> {
  return Array.from(activeSessions.values()).map((session) => ({
    userId: session.userId,
    status: session.status,
    sessionId: session.sessionId,
  }));
}

/**
 * Helper: Log message to database
 */
async function logMessage(
  userId: number,
  platform: "whatsapp" | "telegram" | "signal",
  direction: "inbound" | "outbound",
  content: string,
  remoteJid: string
): Promise<void> {
  try {
    const { getDb } = await import("./db");
    const { messages } = await import("../drizzle/schema");
    const db = await getDb();
    
    if (!db) {
      console.warn("[Baileys] Cannot log message: database not available");
      return;
    }

    await db.insert(messages).values({
      userId,
      platform,
      direction,
      messageType: "text",
      content,
      respondedBy: direction === "outbound" ? "AI" : undefined,
      responseTime: direction === "outbound" ? 2 : undefined, // Approximate 2s response time
    });

    console.log(`[Baileys] Logged ${direction} message for user ${userId}`);
  } catch (error) {
    console.error(`[Baileys] Error logging message:`, error);
  }
}

/**
 * Helper: Auto-add unknown contact from incoming message
 */
async function autoAddUnknownContact(
  userId: number,
  remoteJid: string,
  platform: "whatsapp" | "telegram" | "signal"
): Promise<void> {
  try {
    const { getDb } = await import("./db");
    const { contacts } = await import("../drizzle/schema");
    const { eq, and } = await import("drizzle-orm");
    const db = await getDb();
    
    if (!db) {
      console.warn("[Baileys] Cannot check contact: database not available");
      return;
    }

    // Extract phone number from remoteJid (format: 1234567890@s.whatsapp.net)
    const phone = remoteJid.split('@')[0];
    
    // Check if contact already exists
    const existing = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.userId, userId),
          eq(contacts.phones, JSON.stringify([phone]))
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Contact already exists
      return;
    }

    // Create new contact
    await db.insert(contacts).values({
      userId,
      name: phone, // Use phone as name initially
      phones: JSON.stringify([phone]),
      emails: JSON.stringify([]),
      tags: JSON.stringify(["Auto-added", platform]),
      status: "lead",
      platform: platform,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`[Baileys] Auto-added new contact: ${phone} (${platform})`);
  } catch (error) {
    console.error(`[Baileys] Error auto-adding contact:`, error);
  }
}

/**
 * Helper: Get user's persona configuration
 */
async function getUserPersona(userId: number): Promise<{
  modelId: string | null;
  toneConfig: any;
} | null> {
  try {
    const { getDb } = await import("./db");
    const { chatHistories } = await import("../drizzle/schema");
    const { eq, desc } = await import("drizzle-orm");
    const db = await getDb();
    
    if (!db) {
      console.warn("[Baileys] Cannot fetch persona: database not available");
      return null;
    }

    // Get the most recent persona for this user
    const results = await db
      .select()
      .from(chatHistories)
      .where(eq(chatHistories.userId, userId))
      .orderBy(desc(chatHistories.createdAt))
      .limit(1);

    if (results.length === 0) {
      console.log(`[Baileys] No persona found for user ${userId}, using default`);
      return null;
    }

    const persona = results[0];
    return {
      modelId: persona.personaModelId,
      toneConfig: persona.toneConfig ? JSON.parse(persona.toneConfig as string) : null,
    };
  } catch (error) {
    console.error(`[Baileys] Error fetching persona:`, error);
    return null;
  }
}

/**
 * Helper: Generate AI response using persona
 */
async function generateAIResponse(
  userMessage: string,
  persona: { modelId: string | null; toneConfig: any } | null
): Promise<string | null> {
  try {
    const { invokeLLM } = await import("./_core/llm");

    // Build system prompt with persona tone
    let systemPrompt = "You are a helpful AI concierge assistant for a luxury event planning agency.";
    
    if (persona?.toneConfig) {
      const { tone, language, style } = persona.toneConfig;
      systemPrompt += ` Respond in a ${tone || 'professional'} tone`;
      if (language) systemPrompt += ` in ${language}`;
      if (style) systemPrompt += ` with ${style} style`;
      systemPrompt += ". Keep responses concise and helpful.";
    }

    // Call LLM
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const aiMessage = response.choices?.[0]?.message?.content;
    
    if (!aiMessage) {
      console.error("[Baileys] LLM returned no content");
      return null;
    }

    return aiMessage;
  } catch (error) {
    console.error(`[Baileys] Error generating AI response:`, error);
    return null;
  }
}
