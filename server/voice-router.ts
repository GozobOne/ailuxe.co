import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  transcribeAudio,
  transcribeBase64Audio,
  validateAudioSize,
  validateAudioFormat,
} from "./voice-transcription";

/**
 * Voice Transcription tRPC Router
 */

export const voiceRouter = router({
  /**
   * Transcribe audio from URL
   */
  transcribeUrl: protectedProcedure
    .input(
      z.object({
        audioUrl: z.string().url(),
        language: z.string().optional(),
        prompt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await transcribeAudio(input.audioUrl, input.language, input.prompt);
      return result;
    }),

  /**
   * Transcribe audio from base64
   */
  transcribeBase64: protectedProcedure
    .input(
      z.object({
        base64Audio: z.string(),
        mimeType: z.string(),
        language: z.string().optional(),
        prompt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Validate format
      if (!validateAudioFormat(input.mimeType)) {
        throw new Error(
          "Unsupported audio format. Supported: mp3, wav, ogg, webm, m4a"
        );
      }

      // Validate size (approximate from base64 length)
      const sizeInBytes = (input.base64Audio.length * 3) / 4;
      if (!validateAudioSize(sizeInBytes)) {
        throw new Error("Audio file too large. Maximum size: 25MB");
      }

      const result = await transcribeBase64Audio(
        input.base64Audio,
        input.mimeType,
        input.language,
        input.prompt
      );
      return result;
    }),

  /**
   * Validate audio file
   */
  validateAudio: protectedProcedure
    .input(
      z.object({
        sizeInBytes: z.number(),
        mimeType: z.string(),
      })
    )
    .query(({ input }) => {
      const validSize = validateAudioSize(input.sizeInBytes);
      const validFormat = validateAudioFormat(input.mimeType);

      return {
        valid: validSize && validFormat,
        validSize,
        validFormat,
        maxSize: 25 * 1024 * 1024, // 25MB
      };
    }),
});
