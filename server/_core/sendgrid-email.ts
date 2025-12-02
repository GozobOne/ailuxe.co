/**
 * SendGrid Email Integration
 * 
 * Sends emails via SendGrid API for booking reminders, contract notifications, and analytics reports.
 * Credentials are stored in api_settings table and retrieved at runtime.
 */

import { getApiSetting } from "../db";

interface SendEmailParams {
  to: string; // Recipient email
  subject: string;
  htmlContent: string;
  textContent?: string;
  userId?: number; // Optional: user ID for retrieving credentials
}

interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send email via SendGrid
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
  const { to, subject, htmlContent, textContent, userId } = params;

  try {
    // Get SendGrid API key from database
    const apiKey = userId ? await getApiSetting(userId, "sendgrid_api_key") : null;
    const fromEmail = userId ? await getApiSetting(userId, "sendgrid_from_email") : "noreply@ailuxe.co";
    const fromName = userId ? await getApiSetting(userId, "sendgrid_from_name") : "AI LUXE";

    if (!apiKey) {
      console.error("[SendGrid] Missing API key");
      return {
        success: false,
        error: "SendGrid API key not configured. Please add it in API Settings.",
      };
    }

    // Call SendGrid API
    const url = "https://api.sendgrid.com/v3/mail/send";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
            subject,
          },
        ],
        from: {
          email: fromEmail,
          name: fromName,
        },
        content: [
          {
            type: "text/plain",
            value: textContent || htmlContent.replace(/<[^>]*>/g, ""), // Strip HTML for text version
          },
          {
            type: "text/html",
            value: htmlContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[SendGrid] API error:", errorText);
      return {
        success: false,
        error: `Failed to send email: ${response.statusText}`,
      };
    }

    // SendGrid returns 202 Accepted with X-Message-Id header
    const messageId = response.headers.get("X-Message-Id") || "unknown";
    console.log("[SendGrid] Email sent successfully:", messageId);

    return {
      success: true,
      messageId,
    };
  } catch (error) {
    console.error("[SendGrid] Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send booking reminder email
 */
export async function sendBookingReminderEmail(params: {
  to: string;
  clientName: string;
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  hoursUntil: number;
  userId: number;
}): Promise<SendEmailResponse> {
  const { to, clientName, eventName, eventDate, eventLocation, hoursUntil, userId } = params;

  const subject = `Reminder: ${eventName} in ${hoursUntil} hours`;
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); color: #D4AF37; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px;">AI LUXE</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #FFFFFF;">Time is the Real Luxury</p>
        </div>
        
        <div style="padding: 30px 0;">
          <h2 style="color: #1A1A1A;">Hi ${clientName}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            This is a friendly reminder that your <strong>${eventName}</strong> event is coming up in <strong>${hoursUntil} hours</strong>.
          </p>
          
          <div style="background: #F5F5F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Event:</strong> ${eventName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}</p>
            <p style="margin: 0;"><strong>Location:</strong> ${eventLocation}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            We're looking forward to making your event unforgettable!
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br/>
            <strong>AI LUXE Team</strong>
          </p>
        </div>
        
        <div style="border-top: 1px solid #E0E0E0; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2025 AI LUXE · ailuxe.co · Powered by Briefbot.Tech</p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({ to, subject, htmlContent, userId });
}

/**
 * Send contract signature reminder email
 */
export async function sendContractReminderEmail(params: {
  to: string;
  clientName: string;
  contractType: string;
  contractUrl: string;
  userId: number;
}): Promise<SendEmailResponse> {
  const { to, clientName, contractType, contractUrl, userId } = params;

  const subject = `Action Required: ${contractType} Contract Signature`;
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); color: #D4AF37; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px;">AI LUXE</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #FFFFFF;">Time is the Real Luxury</p>
        </div>
        
        <div style="padding: 30px 0;">
          <h2 style="color: #1A1A1A;">Hi ${clientName}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Your <strong>${contractType}</strong> contract is ready for your review and signature.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${contractUrl}" style="display: inline-block; background: #D4AF37; color: #1A1A1A; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Review & Sign Contract
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            Please review the contract carefully and sign at your earliest convenience. If you have any questions, feel free to reach out to us.
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br/>
            <strong>AI LUXE Team</strong>
          </p>
        </div>
        
        <div style="border-top: 1px solid #E0E0E0; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2025 AI LUXE · ailuxe.co · Powered by Briefbot.Tech</p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({ to, subject, htmlContent, userId });
}

/**
 * Send analytics report email
 */
export async function sendAnalyticsReportEmail(params: {
  to: string;
  tenantName: string;
  reportPeriod: string;
  reportData: {
    totalMessages: number;
    avgResponseTime: string;
    topPlatform: string;
    revenue: string;
  };
  attachmentUrl?: string;
  userId: number;
}): Promise<SendEmailResponse> {
  const { to, tenantName, reportPeriod, reportData, attachmentUrl, userId } = params;

  const subject = `Analytics Report - ${reportPeriod}`;
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); color: #D4AF37; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px;">AI LUXE</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #FFFFFF;">Time is the Real Luxury</p>
        </div>
        
        <div style="padding: 30px 0;">
          <h2 style="color: #1A1A1A;">Analytics Report - ${reportPeriod}</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hi ${tenantName}, here's your performance summary for ${reportPeriod}.
          </p>
          
          <div style="background: #F5F5F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; font-size: 18px;"><strong>📊 Total Messages:</strong> ${reportData.totalMessages}</p>
            <p style="margin: 0 0 15px 0; font-size: 18px;"><strong>⏱️ Avg Response Time:</strong> ${reportData.avgResponseTime}</p>
            <p style="margin: 0 0 15px 0; font-size: 18px;"><strong>🏆 Top Platform:</strong> ${reportData.topPlatform}</p>
            <p style="margin: 0; font-size: 18px;"><strong>💰 Revenue:</strong> ${reportData.revenue}</p>
          </div>
          
          ${attachmentUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${attachmentUrl}" style="display: inline-block; background: #D4AF37; color: #1A1A1A; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Download Full Report (CSV)
            </a>
          </div>
          ` : ''}
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Keep up the great work!<br/>
            <strong>AI LUXE Team</strong>
          </p>
        </div>
        
        <div style="border-top: 1px solid #E0E0E0; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2025 AI LUXE · ailuxe.co · Powered by Briefbot.Tech</p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({ to, subject, htmlContent, userId });
}
