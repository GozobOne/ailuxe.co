import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  getWhiteLabelSettings,
  updateWhiteLabelSettings,
  getOrCreateWhiteLabelSettings,
} from "./white-label-db";

/**
 * White-Label Settings tRPC Router
 * Per-tenant customization settings
 */

export const whiteLabelRouter = router({
  /**
   * Get current user's white-label settings
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    return await getOrCreateWhiteLabelSettings(ctx.user.id);
  }),

  /**
   * Update white-label settings
   */
  update: protectedProcedure
    .input(
      z.object({
        // Branding
        brandName: z.string().max(255).optional(),
        brandLogo: z.string().optional(),
        brandColor: z.string().max(20).optional(),

        // Currency
        currency: z.string().max(10).optional(),
        currencySymbol: z.string().max(10).optional(),

        // Language and locale
        language: z.string().max(10).optional(),
        locale: z.string().max(20).optional(),
        rtl: z.number().int().min(0).max(1).optional(),

        // Voice settings
        voiceModel: z.string().max(100).optional(),
        voiceLanguage: z.string().max(10).optional(),

        // Date/time formats
        dateFormat: z.string().max(50).optional(),
        timeFormat: z.string().max(50).optional(),
        timezone: z.string().max(100).optional(),

        // Tax settings
        taxRate: z.number().int().min(0).max(10000).optional(), // Percentage * 100
        taxLabel: z.string().max(100).optional(),

        // Contract templates
        contractTemplate: z.string().optional(),
        termsUrl: z.string().optional(),
        privacyUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await updateWhiteLabelSettings(ctx.user.id, input);
    }),

  /**
   * Reset to defaults
   */
  reset: protectedProcedure.mutation(async ({ ctx }) => {
    return await updateWhiteLabelSettings(ctx.user.id, {
      brandName: null,
      brandLogo: null,
      brandColor: null,
      currency: "USD",
      currencySymbol: "$",
      language: "en",
      locale: "en-US",
      rtl: 0,
      voiceModel: null,
      voiceLanguage: null,
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      timezone: "UTC",
      taxRate: 0,
      taxLabel: null,
      contractTemplate: null,
      termsUrl: null,
      privacyUrl: null,
    });
  }),
});
