import type { Request, Response } from "express";
import { getDb } from "./db";
import { messages } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";

/**
 * Instagram Webhook Verification
 * Meta requires webhook verification during setup
 */
export function verifyInstagramWebhook(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Verify token should match your configured token in Meta App Dashboard
  const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || "ailuxe_instagram_verify_2025";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Instagram] Webhook verified");
    res.status(200).send(challenge);
  } else {
    console.error("[Instagram] Webhook verification failed");
    res.sendStatus(403);
  }
}

/**
 * Instagram Webhook Handler
 * Processes incoming Instagram DMs via Meta Graph API
 */
export async function handleInstagramWebhook(req: Request, res: Response) {
  const body = req.body;

  // Verify this is from Instagram
  if (body.object !== "instagram") {
    return res.sendStatus(404);
  }

  try {
    // Process each entry
    for (const entry of body.entry) {
      // Get messaging events
      const messagingEvents = entry.messaging || [];

      for (const event of messagingEvents) {
        if (event.message) {
          await processInstagramMessage(event);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("[Instagram] Webhook processing error:", error);
    res.sendStatus(500);
  }
}

/**
 * Process individual Instagram DM
 */
async function processInstagramMessage(event: any) {
  const senderId = event.sender.id;
  const recipientId = event.recipient.id;
  const messageText = event.message.text;
  const timestamp = event.timestamp;

  console.log(`[Instagram] Message from ${senderId}: ${messageText}`);

  // Log incoming message to database
  await logInstagramMessage({
    platform: "instagram",
    direction: "inbound",
    senderId,
    recipientId,
    content: messageText,
    timestamp: new Date(timestamp),
  });

  // Generate AI response
  const aiResponse = await generateInstagramResponse(messageText, senderId);

  // Send response via Instagram Graph API
  await sendInstagramMessage(senderId, aiResponse);

  // Log outbound message
  await logInstagramMessage({
    platform: "instagram",
    direction: "outbound",
    senderId: recipientId,
    recipientId: senderId,
    content: aiResponse,
    timestamp: new Date(),
    respondedBy: "AI Concierge",
  });
}

/**
 * Log Instagram message to database
 */
async function logInstagramMessage(data: {
  platform: string;
  direction: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  respondedBy?: string;
}) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(messages).values({
      platform: data.platform,
      direction: data.direction,
      content: data.content,
      respondedBy: data.respondedBy,
      createdAt: data.timestamp,
    });
  } catch (error) {
    console.error("[Instagram] Failed to log message:", error);
  }
}

/**
 * Generate AI response for Instagram DM
 */
async function generateInstagramResponse(messageText: string, senderId: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an AI concierge for luxury event planning. You represent AI LUXE, a premium event management service.
          
Your tone is:
- Professional yet warm
- Sophisticated and elegant
- Helpful and attentive
- Time-conscious (our tagline: "Time is the Real Luxury")

Your capabilities:
- Event booking and consultation
- Budget planning and negotiation
- Venue recommendations
- Calendar management
- 24/7 availability

Keep responses concise for Instagram DM format (under 200 characters when possible).`,
        },
        {
          role: "user",
          content: messageText,
        },
      ],
    });

    return response.choices[0]?.message?.content || "Thank you for your message. How may I assist you with your luxury event planning needs?";
  } catch (error) {
    console.error("[Instagram] AI response generation failed:", error);
    return "Thank you for reaching out to AI LUXE. Our team will respond shortly.";
  }
}

/**
 * Send message via Instagram Graph API
 */
async function sendInstagramMessage(recipientId: string, messageText: string) {
  const PAGE_ACCESS_TOKEN = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN;

  if (!PAGE_ACCESS_TOKEN) {
    console.error("[Instagram] Missing PAGE_ACCESS_TOKEN");
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText },
        access_token: PAGE_ACCESS_TOKEN,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Instagram] Failed to send message:", error);
    } else {
      console.log(`[Instagram] Message sent to ${recipientId}`);
    }
  } catch (error) {
    console.error("[Instagram] Send message error:", error);
  }
}
