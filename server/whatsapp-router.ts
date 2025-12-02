import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  sendTextMessage,
  sendTemplateMessage,
  testWhatsAppConnection,
  sendWhatsAppMessage,
} from "./whatsapp-business-api";
import {
  getWhatsAppCredentials,
  setApiSetting,
} from "./api-settings-db";

/**
 * WhatsApp Business Cloud API tRPC Router
 * Handles real message sending using Meta Graph API
 */

export const whatsappRouter = router({
  /**
   * Save WhatsApp API credentials
   */
  saveCredentials: protectedProcedure
    .input(
      z.object({
        phoneNumberId: z.string().min(1),
        accessToken: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const phoneSuccess = await setApiSetting(
        "whatsapp_phone_number_id",
        input.phoneNumberId,
        "whatsapp",
        "WhatsApp Business Phone Number ID from Meta Developer Console",
        true,
        ctx.user.openId
      );

      const tokenSuccess = await setApiSetting(
        "whatsapp_access_token",
        input.accessToken,
        "whatsapp",
        "WhatsApp Business API Access Token from Meta Developer Console",
        true,
        ctx.user.openId
      );

      return {
        success: phoneSuccess && tokenSuccess,
      };
    }),

  /**
   * Test WhatsApp API connection
   */
  testConnection: protectedProcedure.mutation(async () => {
    const credentials = await getWhatsAppCredentials();

    if (!credentials.phoneNumberId || !credentials.accessToken) {
      return {
        success: false,
        error: "WhatsApp API credentials not configured. Please save your Phone Number ID and Access Token first.",
      };
    }

    return await testWhatsAppConnection({
      phoneNumberId: credentials.phoneNumberId,
      accessToken: credentials.accessToken,
    });
  }),

  /**
   * Send text message
   */
  sendText: protectedProcedure
    .input(
      z.object({
        to: z.string().regex(/^\d{10,15}$/, "Invalid phone number format"),
        text: z.string().min(1).max(4096),
      })
    )
    .mutation(async ({ input }) => {
      const credentials = await getWhatsAppCredentials();

      if (!credentials.phoneNumberId || !credentials.accessToken) {
        return {
          success: false,
          error: "WhatsApp API credentials not configured",
        };
      }

      return await sendTextMessage(
        {
          phoneNumberId: credentials.phoneNumberId,
          accessToken: credentials.accessToken,
        },
        input.to,
        input.text
      );
    }),

  /**
   * Send template message
   */
  sendTemplate: protectedProcedure
    .input(
      z.object({
        to: z.string().regex(/^\d{10,15}$/, "Invalid phone number format"),
        templateName: z.string().min(1),
        languageCode: z.string().default("en_US"),
      })
    )
    .mutation(async ({ input }) => {
      const credentials = await getWhatsAppCredentials();

      if (!credentials.phoneNumberId || !credentials.accessToken) {
        return {
          success: false,
          error: "WhatsApp API credentials not configured",
        };
      }

      return await sendTemplateMessage(
        {
          phoneNumberId: credentials.phoneNumberId,
          accessToken: credentials.accessToken,
        },
        input.to,
        input.templateName,
        input.languageCode
      );
    }),

  /**
   * Send media message (image, document, video, audio)
   */
  sendMedia: protectedProcedure
    .input(
      z.object({
        to: z.string().regex(/^\d{10,15}$/, "Invalid phone number format"),
        type: z.enum(["image", "document", "audio", "video"]),
        mediaUrl: z.string().url(),
        caption: z.string().optional(),
        filename: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const credentials = await getWhatsAppCredentials();

      if (!credentials.phoneNumberId || !credentials.accessToken) {
        return {
          success: false,
          error: "WhatsApp API credentials not configured",
        };
      }

      return await sendWhatsAppMessage(
        {
          phoneNumberId: credentials.phoneNumberId,
          accessToken: credentials.accessToken,
        },
        {
          to: input.to,
          type: input.type,
          media: {
            link: input.mediaUrl,
            caption: input.caption,
            filename: input.filename,
          },
        }
      );
    }),

  /**
   * Get current credentials status (without exposing values)
   */
  getCredentialsStatus: protectedProcedure.query(async () => {
    const credentials = await getWhatsAppCredentials();

    return {
      phoneNumberIdConfigured: !!credentials.phoneNumberId,
      accessTokenConfigured: !!credentials.accessToken,
      ready: !!credentials.phoneNumberId && !!credentials.accessToken,
    };
  }),
});
