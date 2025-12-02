import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  uploadChatHistory, 
  processChatHistory, 
  getChatHistoriesByUser,
  getPersonaById,
  getRecentMessages,
  getMessagesByPlatform,
  getMessageStats,
  createMessage,
  searchMessages,
  getAnalyticsData,
  getRevenueForecast
} from "./db";
import { storagePut } from "./storage";
import { invokeLLM } from "./_core/llm";
import { baileysRouter } from "./baileys-router";
import { getSubscriptionStatus, getActiveTrialUsers, getTrialsExpiringSoon, convertTrialToPaid, runSubscriptionMaintenance } from "./subscription-tracker";
import { generateRevenueForecast, storeForecast, runForecastEngine } from "./revenue-forecast-engine";
import { analyticsRouter } from "./analytics-router";
import { googleCalendarRouter } from "./google-calendar-router";
import { voiceRouter } from "./voice-router";
import { billingRouter } from "./billing-router";
import { whiteLabelRouter } from "./white-label-router";
import { whatsappRouter } from "./whatsapp-router";
import { fileUploadRouter } from "./file-upload-router";
import { contactsRouter } from "./contacts-router";
import { contractsRouter } from "./contracts-router";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  persona: router({
    // Upload chat history file
    uploadChatHistory: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileContent: z.string(), // base64 encoded
        fileType: z.enum(['txt', 'json', 'pdf']),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        
        // Decode base64 and upload to S3
        const fileBuffer = Buffer.from(input.fileContent, 'base64');
        const fileKey = `chat-histories/${userId}/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(fileKey, fileBuffer, 'application/octet-stream');
        
        // Save to database
        const chatHistory = await uploadChatHistory({
          userId,
          fileName: input.fileName,
          fileType: input.fileType,
          fileUrl: url,
          fileKey,
        });
        
        return chatHistory;
      }),

    // Process chat history and clone persona
    clonePersona: protectedProcedure
      .input(z.object({
        chatHistoryId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        
        // Get chat history
        const chatHistory = await getPersonaById(input.chatHistoryId);
        
        if (!chatHistory || chatHistory.userId !== userId) {
          throw new Error('Chat history not found or unauthorized');
        }
        
        // Process the chat history
        const result = await processChatHistory(chatHistory);
        
        return result;
      }),

    // Get all chat histories for current user
    list: protectedProcedure
      .query(async ({ ctx }) => {
        const userId = ctx.user.id;
        return await getChatHistoriesByUser(userId);
      }),

    // Get persona details
    getPersona: protectedProcedure
      .input(z.object({
        chatHistoryId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        const persona = await getPersonaById(input.chatHistoryId);
        
        if (!persona || persona.userId !== userId) {
          throw new Error('Persona not found or unauthorized');
        }
        
        return persona;
      }),
  }),

  // Baileys WhatsApp QR connection
  baileys: baileysRouter,
  
  // Analytics Dashboard
  analytics: analyticsRouter,

  // Google Calendar integration
  googleCalendar: googleCalendarRouter,

  // Live monitoring
  subscriptions: router({
    getStatus: protectedProcedure
      .input(z.object({ userId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.user.id;
        return await getSubscriptionStatus(userId);
      }),
    getActiveTrials: protectedProcedure.query(async () => {
      return await getActiveTrialUsers();
    }),
    getExpiringSoon: protectedProcedure.query(async () => {
      return await getTrialsExpiringSoon();
    }),
    convertToPaid: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        const success = await convertTrialToPaid(input.userId);
        return { success };
      }),
    runMaintenance: protectedProcedure.mutation(async () => {
      return await runSubscriptionMaintenance();
    }),
  }),

  // Message Hub - Real database integration
  messages: router({
    getRecent: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await getRecentMessages(ctx.user.id, input.limit || 50);
      }),
    
    getByPlatform: protectedProcedure
      .input(z.object({
        platform: z.enum(['whatsapp', 'telegram', 'signal']),
        limit: z.number().optional(),
      }))
      .query(async ({ ctx, input }) => {
        return await getMessagesByPlatform(ctx.user.id, input.platform, input.limit || 50);
      }),
    
    getStats: protectedProcedure
      .query(async ({ ctx }) => {
        return await getMessageStats(ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        platform: z.enum(['whatsapp', 'telegram', 'signal']),
        direction: z.enum(['inbound', 'outbound']),
        messageType: z.enum(['text', 'voice', 'image', 'document']).optional(),
        content: z.string().optional(),
        mediaUrl: z.string().optional(),
        transcription: z.string().optional(),
        respondedBy: z.string().optional(),
        responseTime: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await createMessage({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),

  monitoring: router({
    getRecentMessages: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const { messages } = await import("../drizzle/schema");
      const { desc } = await import("drizzle-orm");
      const db = await getDb();
      
      if (!db) {
        return [];
      }

      const recentMessages = await db
        .select()
        .from(messages)
        .orderBy(desc(messages.createdAt))
        .limit(50);

      return recentMessages;
    }),

    getRecentBookings: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const { bookings } = await import("../drizzle/schema");
      const { desc } = await import("drizzle-orm");
      const db = await getDb();
      
      if (!db) {
        return [];
      }

      const recentBookings = await db
        .select()
        .from(bookings)
        .orderBy(desc(bookings.createdAt))
        .limit(20);

      return recentBookings;
    }),
  }),

  // Voice transcription
  voice: voiceRouter,

  // Billing system
  billing: billingRouter,

  // White-label settings
  whiteLabel: whiteLabelRouter,

  // WhatsApp Business Cloud API
  whatsapp: whatsappRouter,
  
  // Telegram Bot (placeholder for future implementation)
  telegram: router({
    connect: protectedProcedure
      .input(z.object({ botToken: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement Telegram bot connection
        return { success: false, message: 'Telegram integration coming soon' };
      }),
    status: protectedProcedure
      .query(async ({ ctx }) => {
        // TODO: Implement Telegram status check
        return { connected: false, messagesHandled: 0 };
      }),
  }),
  
  // Signal Bot (placeholder for future implementation)
  signal: router({
    connect: protectedProcedure
      .input(z.object({ phoneNumber: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement Signal bot connection
        return { success: false, message: 'Signal integration coming soon' };
      }),
    status: protectedProcedure
      .query(async ({ ctx }) => {
        // TODO: Implement Signal status check
        return { connected: false, messagesHandled: 0 };
      }),
  }),
  
  // File Upload for message attachments
  fileUpload: fileUploadRouter,
  
  // Contact Management
  contacts: contactsRouter,
  
  // Contract Generation
  contracts: contractsRouter,
  
  // Message Search
  messageSearch: router({
    search: protectedProcedure
      .input(z.object({
        query: z.string().optional(),
        platform: z.enum(['whatsapp', 'telegram', 'signal']).optional(),
        messageType: z.enum(['text', 'voice', 'image', 'document']).optional(),
        direction: z.enum(['inbound', 'outbound']).optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        return await searchMessages(ctx.user.id, input);
      }),
    
    stats: protectedProcedure.query(async ({ ctx }) => {
      return await getMessageStats(ctx.user.id);
    }),
  }),

  // Revenue Forecasting (part of analytics)
  revenueForecast: router({
    data: protectedProcedure
      .input(z.object({ days: z.number().optional().default(30) }))
      .query(async ({ ctx, input }) => {
        return await getAnalyticsData(ctx.user.id, input.days);
      }),
    
    revenueForecast: protectedProcedure.query(async ({ ctx }) => {
      return await getRevenueForecast(ctx.user.id);
    }),

    generateForecast: protectedProcedure
      .input(z.object({ monthsAhead: z.number().min(1).max(12).default(6) }))
      .mutation(async ({ ctx, input }) => {
        const forecasts = await generateRevenueForecast({
          userId: ctx.user.id,
          monthsAhead: input.monthsAhead,
        });
        
        // Store forecasts
        for (const forecast of forecasts) {
          await storeForecast(ctx.user.id, forecast);
        }
        
        return { success: true, forecasts };
      }),
  }),
});

export type AppRouter = typeof appRouter;
