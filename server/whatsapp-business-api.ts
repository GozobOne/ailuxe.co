import fetch from "node-fetch";

/**
 * WhatsApp Business Cloud API Integration
 * Uses Meta Graph API to send/receive WhatsApp messages
 * Requires: Phone Number ID + Access Token from Meta Developer Console
 */

interface WhatsAppCredentials {
  phoneNumberId: string;
  accessToken: string;
}

interface SendMessageParams {
  to: string; // Recipient phone number (with country code, no + sign)
  type: "text" | "template" | "image" | "document" | "audio" | "video";
  text?: string;
  template?: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: string;
      parameters: Array<{ type: string; text?: string; image?: { link: string } }>;
    }>;
  };
  media?: {
    link?: string;
    caption?: string;
    filename?: string;
  };
}

interface WhatsAppAPIResponse {
  messaging_product: string;
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

/**
 * Send WhatsApp message using Business Cloud API
 */
export async function sendWhatsAppMessage(
  credentials: WhatsAppCredentials,
  params: SendMessageParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { phoneNumberId, accessToken } = credentials;

    if (!phoneNumberId || !accessToken) {
      return {
        success: false,
        error: "Missing WhatsApp API credentials (Phone Number ID or Access Token)",
      };
    }

    // Build request payload based on message type
    const payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: params.to,
      type: params.type,
    };

    // Add type-specific content
    switch (params.type) {
      case "text":
        if (!params.text) {
          return { success: false, error: "Text message requires 'text' parameter" };
        }
        payload.text = { body: params.text };
        break;

      case "template":
        if (!params.template) {
          return { success: false, error: "Template message requires 'template' parameter" };
        }
        payload.template = params.template;
        break;

      case "image":
      case "document":
      case "audio":
      case "video":
        if (!params.media?.link) {
          return { success: false, error: `${params.type} message requires media link` };
        }
        payload[params.type] = {
          link: params.media.link,
          ...(params.media.caption && { caption: params.media.caption }),
          ...(params.media.filename && { filename: params.media.filename }),
        };
        break;

      default:
        return { success: false, error: `Unsupported message type: ${params.type}` };
    }

    // Send request to Meta Graph API
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = (await response.json()) as any;

    if (!response.ok) {
      console.error("[WhatsApp API] Error:", data);
      return {
        success: false,
        error: data.error?.message || `API error: ${response.status}`,
      };
    }

    const apiResponse = data as WhatsAppAPIResponse;

    console.log(`[WhatsApp API] Message sent successfully:`, apiResponse.messages[0].id);

    return {
      success: true,
      messageId: apiResponse.messages[0].id,
    };
  } catch (error) {
    console.error("[WhatsApp API] Send message error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send text message (convenience function)
 */
export async function sendTextMessage(
  credentials: WhatsAppCredentials,
  to: string,
  text: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendWhatsAppMessage(credentials, {
    to,
    type: "text",
    text,
  });
}

/**
 * Send template message (e.g., hello_world)
 */
export async function sendTemplateMessage(
  credentials: WhatsAppCredentials,
  to: string,
  templateName: string,
  languageCode: string = "en_US"
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendWhatsAppMessage(credentials, {
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
    },
  });
}

/**
 * Test WhatsApp API connection
 * Validates credentials without sending a message
 */
export async function testWhatsAppConnection(
  credentials: WhatsAppCredentials
): Promise<{ success: boolean; error?: string; details?: any }> {
  try {
    const { phoneNumberId, accessToken } = credentials;

    if (!phoneNumberId || !accessToken) {
      return {
        success: false,
        error: "Missing WhatsApp API credentials",
      };
    }

    // Test by fetching phone number info
    const response = await fetch(
      `https://graph.facebook.com/v22.0/${phoneNumberId}?fields=verified_name,code_verification_status,display_phone_number,quality_rating`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = (await response.json()) as any;

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || "Invalid credentials",
        details: data.error,
      };
    }

    console.log("[WhatsApp API] Connection test successful:", data);

    return {
      success: true,
      details: {
        verifiedName: data.verified_name,
        displayPhoneNumber: data.display_phone_number,
        qualityRating: data.quality_rating,
        verificationStatus: data.code_verification_status,
      },
    };
  } catch (error) {
    console.error("[WhatsApp API] Connection test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(
  credentials: WhatsAppCredentials,
  messageId: string
): Promise<boolean> {
  try {
    const { phoneNumberId, accessToken } = credentials;

    const response = await fetch(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("[WhatsApp API] Mark as read error:", error);
    return false;
  }
}
