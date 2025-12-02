import { Request, Response } from "express";
import { getDb } from "./db";
import { apiSettings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * WhatsApp Webhook Handler
 * Handles Meta verification and incoming messages from WhatsApp Business Cloud API
 */

interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: string;
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: { display_phone_number: string; phone_number_id: string };
        contacts?: Array<{ profile: { name: string }; wa_id: string }>;
        messages?: WhatsAppMessage[];
      };
      field: string;
    }>;
  }>;
}

/**
 * Get API setting value from database
 */
async function getApiSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    console.error("[WhatsApp] Database not available");
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
    console.error(`[WhatsApp] Error fetching API setting ${key}:`, error);
    return null;
  }
}

/**
 * Webhook verification (GET request from Meta)
 * Meta sends a verification request when you configure the webhook URL
 */
export async function verifyWebhook(req: Request, res: Response) {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("[WhatsApp] Verification request received:", { mode, token: token ? "***" : undefined });

    // Check if mode and token are present
    if (!mode || !token) {
      console.error("[WhatsApp] Missing mode or token in verification request");
      return res.status(400).send("Missing parameters");
    }

    // Verify mode is 'subscribe'
    if (mode !== "subscribe") {
      console.error("[WhatsApp] Invalid mode:", mode);
      return res.status(403).send("Invalid mode");
    }

    // Get verify token from database
    const storedToken = await getApiSetting("whatsapp_verify_token");

    if (!storedToken) {
      console.error("[WhatsApp] Verify token not configured in API settings");
      return res.status(500).send("Webhook not configured");
    }

    // Verify token matches
    if (token === storedToken) {
      console.log("[WhatsApp] Verification successful");
      return res.status(200).send(challenge);
    } else {
      console.error("[WhatsApp] Token mismatch");
      return res.status(403).send("Verification failed");
    }
  } catch (error) {
    console.error("[WhatsApp] Verification error:", error);
    return res.status(500).send("Internal server error");
  }
}

/**
 * Handle incoming webhook events (POST request from Meta)
 */
export async function handleWebhook(req: Request, res: Response) {
  try {
    const payload: WhatsAppWebhookPayload = req.body;

    console.log("[WhatsApp] Webhook received:", JSON.stringify(payload, null, 2));

    // Verify payload structure
    if (!payload.object || payload.object !== "whatsapp_business_account") {
      console.error("[WhatsApp] Invalid payload object:", payload.object);
      return res.status(400).send("Invalid payload");
    }

    // Process each entry
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field !== "messages") {
          console.log("[WhatsApp] Skipping non-message change:", change.field);
          continue;
        }

        const { value } = change;
        const { messages, contacts, metadata } = value;

        if (!messages || messages.length === 0) {
          console.log("[WhatsApp] No messages in payload");
          continue;
        }

        // Process each message
        for (const message of messages) {
          await processMessage(message, contacts, metadata);
        }
      }
    }

    // Always respond with 200 to acknowledge receipt
    return res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error("[WhatsApp] Webhook processing error:", error);
    // Still return 200 to prevent Meta from retrying
    return res.status(200).send("ERROR");
  }
}

/**
 * Process individual WhatsApp message
 */
async function processMessage(
  message: WhatsAppMessage,
  contacts: Array<{ profile: { name: string }; wa_id: string }> | undefined,
  metadata: { display_phone_number: string; phone_number_id: string }
) {
  try {
    console.log("[WhatsApp] Processing message:", {
      from: message.from,
      type: message.type,
      timestamp: message.timestamp,
    });

    // Get sender info
    const senderName = contacts?.find((c) => c.wa_id === message.from)?.profile.name || "Unknown";

    // Handle different message types
    switch (message.type) {
      case "text":
        if (message.text?.body) {
          await handleTextMessage(message.from, message.text.body, senderName, metadata);
        }
        break;

      case "image":
      case "video":
      case "audio":
      case "document":
        console.log(`[WhatsApp] Media message received (${message.type}), handling not yet implemented`);
        break;

      default:
        console.log(`[WhatsApp] Unsupported message type: ${message.type}`);
    }
  } catch (error) {
    console.error("[WhatsApp] Message processing error:", error);
  }
}

/**
 * Handle text message
 * TODO: Integrate with AI persona and response generation
 */
async function handleTextMessage(
  from: string,
  text: string,
  senderName: string,
  metadata: { display_phone_number: string; phone_number_id: string }
) {
  console.log("[WhatsApp] Text message:", {
    from,
    senderName,
    text,
    businessPhone: metadata.display_phone_number,
  });

  // TODO: Phase 2 implementation
  // 1. Fetch user's persona configuration
  // 2. Generate AI response using persona tone
  // 3. Send response via WhatsApp Business API
  // 4. Log conversation in database

  // For now, just log the message
  console.log(`[WhatsApp] Message from ${senderName} (${from}): ${text}`);
}

/**
 * Send WhatsApp message (outbound)
 * Requires phone_id and access_token from API settings
 */
export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  try {
    const phoneId = await getApiSetting("whatsapp_phone_id");
    const accessToken = await getApiSetting("whatsapp_access_token");

    if (!phoneId || !accessToken) {
      console.error("[WhatsApp] Missing credentials for sending messages");
      return false;
    }

    const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[WhatsApp] Send message failed:", error);
      return false;
    }

    const result = await response.json();
    console.log("[WhatsApp] Message sent successfully:", result);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Send message error:", error);
    return false;
  }
}
