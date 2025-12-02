import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage";
import { createMessage } from "./db";

export const fileUploadRouter = router({
  // Upload image attachment
  uploadImage: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileContent: z.string(), // base64 encoded
      platform: z.enum(['whatsapp', 'telegram', 'signal']),
      direction: z.enum(['inbound', 'outbound']),
      caption: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Decode base64 and upload to S3
      const fileBuffer = Buffer.from(input.fileContent, 'base64');
      const fileKey = `message-attachments/${userId}/${input.platform}/${Date.now()}-${input.fileName}`;
      
      const { url } = await storagePut(fileKey, fileBuffer, 'image/jpeg');
      
      // Create message record in database
      await createMessage({
        userId,
        platform: input.platform,
        direction: input.direction,
        messageType: 'image',
        content: input.caption,
        mediaUrl: url,
      });
      
      return { success: true, url, fileKey };
    }),

  // Upload document attachment
  uploadDocument: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileContent: z.string(), // base64 encoded
      platform: z.enum(['whatsapp', 'telegram', 'signal']),
      direction: z.enum(['inbound', 'outbound']),
      caption: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Decode base64 and upload to S3
      const fileBuffer = Buffer.from(input.fileContent, 'base64');
      const fileKey = `message-attachments/${userId}/${input.platform}/${Date.now()}-${input.fileName}`;
      
      // Determine content type based on file extension
      const ext = input.fileName.split('.').pop()?.toLowerCase();
      const contentType = ext === 'pdf' ? 'application/pdf' : 'application/octet-stream';
      
      const { url } = await storagePut(fileKey, fileBuffer, contentType);
      
      // Create message record in database
      await createMessage({
        userId,
        platform: input.platform,
        direction: input.direction,
        messageType: 'document',
        content: input.caption,
        mediaUrl: url,
      });
      
      return { success: true, url, fileKey };
    }),

  // Upload voice note
  uploadVoice: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileContent: z.string(), // base64 encoded
      platform: z.enum(['whatsapp', 'telegram', 'signal']),
      direction: z.enum(['inbound', 'outbound']),
      transcription: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Decode base64 and upload to S3
      const fileBuffer = Buffer.from(input.fileContent, 'base64');
      const fileKey = `message-attachments/${userId}/${input.platform}/${Date.now()}-${input.fileName}`;
      
      const { url } = await storagePut(fileKey, fileBuffer, 'audio/ogg');
      
      // Create message record in database
      await createMessage({
        userId,
        platform: input.platform,
        direction: input.direction,
        messageType: 'voice',
        mediaUrl: url,
        transcription: input.transcription,
      });
      
      return { success: true, url, fileKey };
    }),

  // Get upload URL for direct client upload (alternative method)
  getUploadUrl: protectedProcedure
    .input(z.object({
      fileName: z.string(),
      fileType: z.enum(['image', 'document', 'voice']),
      platform: z.enum(['whatsapp', 'telegram', 'signal']),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const fileKey = `message-attachments/${userId}/${input.platform}/${Date.now()}-${input.fileName}`;
      
      // Return the file key for client to use
      return { 
        fileKey,
        uploadPath: `/api/upload/${fileKey}`,
      };
    }),
});
