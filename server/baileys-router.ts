import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  initializeBaileysConnection,
  getBaileysStatus,
  disconnectBaileys,
  sendBaileysMessage,
  getActiveSessions,
} from "./baileys-manager";

/**
 * Baileys tRPC Router
 * Handles QR code generation and WhatsApp connection management
 */

export const baileysRouter = router({
  /**
   * Initialize connection and get QR code
   */
  connect: protectedProcedure.mutation(async ({ ctx }) => {
    const result = await initializeBaileysConnection(ctx.user.id);
    return result;
  }),

  /**
   * Get current connection status
   */
  status: protectedProcedure.query(({ ctx }) => {
    return getBaileysStatus(ctx.user.id);
  }),

  /**
   * Disconnect Baileys session
   */
  disconnect: protectedProcedure.mutation(async ({ ctx }) => {
    const success = await disconnectBaileys(ctx.user.id);
    return { success };
  }),

  /**
   * Send test message
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        to: z.string().min(10).max(20), // Phone number
        message: z.string().min(1).max(4096),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const success = await sendBaileysMessage(ctx.user.id, input.to, input.message);
      return { success };
    }),

  /**
   * Test AI response with persona
   */
  testAIResponse: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(4096),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Import dependencies
      const { invokeLLM } = await import("./_core/llm");
      const { getDb } = await import("./db");
      const { chatHistories } = await import("../drizzle/schema");
      const { eq, desc } = await import("drizzle-orm");
      
      const db = await getDb();
      
      // Get user's persona
      let systemPrompt = "You are a helpful AI concierge assistant for a luxury event planning agency.";
      
      if (db) {
        const results = await db
          .select()
          .from(chatHistories)
          .where(eq(chatHistories.userId, ctx.user.id))
          .orderBy(desc(chatHistories.createdAt))
          .limit(1);
        
        if (results.length > 0 && results[0].toneConfig) {
          try {
            const toneConfig = JSON.parse(results[0].toneConfig as string);
            const { tone, language, responseStyle } = toneConfig;
            systemPrompt += ` Respond in a ${tone || 'professional'} tone`;
            if (language) systemPrompt += ` in ${language}`;
            if (responseStyle) systemPrompt += ` with ${responseStyle} style`;
            systemPrompt += ". Keep responses concise and helpful.";
          } catch (error) {
            console.error("Error parsing tone config:", error);
          }
        }
      }
      
      // Generate AI response
      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.message },
        ],
      });
      
      const aiMessage = response.choices?.[0]?.message?.content;
      
      if (!aiMessage) {
        throw new Error("Failed to generate AI response");
      }
      
      return { response: aiMessage };
    }),

  /**
   * Get all active sessions (admin only)
   */
  activeSessions: protectedProcedure.query(({ ctx }) => {
    // TODO: Add admin-only check
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }
    return getActiveSessions();
  }),
});
