/**
 * Twilio SMS Integration
 * 
 * Sends SMS messages via Twilio API for booking reminders and notifications.
 * Credentials are stored in api_settings table and retrieved at runtime.
 */

import { getApiSetting } from "../db";

interface SendSMSParams {
  to: string; // Phone number in E.164 format (+1234567890)
  message: string;
  userId?: number; // Optional: user ID for retrieving credentials
}

interface SendSMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(params: SendSMSParams): Promise<SendSMSResponse> {
  const { to, message, userId } = params;

  try {
    // Get Twilio credentials from database
    const accountSid = userId ? await getApiSetting(userId, "twilio_account_sid") : null;
    const authToken = userId ? await getApiSetting(userId, "twilio_auth_token") : null;
    const fromNumber = userId ? await getApiSetting(userId, "twilio_phone_number") : null;

    if (!accountSid || !authToken || !fromNumber) {
      console.error("[Twilio] Missing credentials");
      return {
        success: false,
        error: "Twilio credentials not configured. Please add them in API Settings.",
      };
    }

    // Call Twilio API
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: to,
        Body: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Twilio] API error:", errorData);
      return {
        success: false,
        error: errorData.message || "Failed to send SMS",
      };
    }

    const data = await response.json();
    console.log("[Twilio] SMS sent successfully:", data.sid);

    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error) {
    console.error("[Twilio] Error sending SMS:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send booking reminder SMS
 */
export async function sendBookingReminder(params: {
  to: string;
  clientName: string;
  eventName: string;
  eventDate: Date;
  hoursUntil: number;
  userId: number;
}): Promise<SendSMSResponse> {
  const { to, clientName, eventName, eventDate, hoursUntil, userId } = params;

  const message = `Hi ${clientName}! Reminder: Your ${eventName} event is in ${hoursUntil} hours on ${eventDate.toLocaleDateString()}. Looking forward to seeing you! - AI LUXE`;

  return await sendSMS({ to, message, userId });
}

/**
 * Send contract signature reminder SMS
 */
export async function sendContractReminder(params: {
  to: string;
  clientName: string;
  contractType: string;
  userId: number;
}): Promise<SendSMSResponse> {
  const { to, clientName, contractType, userId } = params;

  const message = `Hi ${clientName}! Your ${contractType} contract is ready for signature. Please review and sign at your earliest convenience. - AI LUXE`;

  return await sendSMS({ to, message, userId });
}
