import { getDb } from "./db";
import { apiSettings } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import FormData from "form-data";
import fetch from "node-fetch";

/**
 * Voice Transcription via OpenRouter DeepSeek Whisper
 * Handles audio file transcription using OpenRouter API
 */

interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

/**
 * Get API setting value from database
 */
async function getApiSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    console.error("[Voice] Database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(apiSettings)
      .where(eq(apiSettings.key, key))
      .limit(1);

    return result.length > 0 ? result[0].value : null;
  } catch (error) {
    console.error(`[Voice] Error fetching API setting ${key}:`, error);
    return null;
  }
}

/**
 * Transcribe audio file using OpenRouter DeepSeek Whisper
 * 
 * @param audioUrl - URL to audio file (must be publicly accessible)
 * @param language - Optional language code (e.g., "en", "ar")
 * @param prompt - Optional context hint for better accuracy
 */
export async function transcribeAudio(
  audioUrl: string,
  language?: string,
  prompt?: string
): Promise<TranscriptionResult> {
  try {
    const apiKey = await getApiSetting("openrouter_api_key");

    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    // Fetch audio file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to fetch audio file: ${audioResponse.statusText}`);
    }

    const audioBuffer = await audioResponse.buffer();
    const contentType = audioResponse.headers.get("content-type") || "audio/mpeg";

    // Determine file extension from content type
    const ext = getFileExtension(contentType);

    // Create form data
    const formData = new FormData();
    formData.append("file", audioBuffer, {
      filename: `audio.${ext}`,
      contentType,
    });
    formData.append("model", "deepseek/deepseek-whisper");

    if (language) {
      formData.append("language", language);
    }

    if (prompt) {
      formData.append("prompt", prompt);
    }

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Voice] Transcription failed:", error);
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();

    console.log("[Voice] Transcription successful");

    return {
      text: result.text,
      language: result.language,
      duration: result.duration,
    };
  } catch (error) {
    console.error("[Voice] Transcription error:", error);
    throw error;
  }
}

/**
 * Get file extension from content type
 */
function getFileExtension(contentType: string): string {
  const typeMap: Record<string, string> = {
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/wave": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
    "audio/webm": "webm",
    "audio/mp4": "m4a",
    "audio/x-m4a": "m4a",
  };

  return typeMap[contentType] || "mp3";
}

/**
 * Transcribe audio from base64 encoded data
 * Useful for direct uploads from client
 */
export async function transcribeBase64Audio(
  base64Audio: string,
  mimeType: string,
  language?: string,
  prompt?: string
): Promise<TranscriptionResult> {
  try {
    const apiKey = await getApiSetting("openrouter_api_key");

    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    // Decode base64
    const audioBuffer = Buffer.from(base64Audio, "base64");
    const ext = getFileExtension(mimeType);

    // Create form data
    const formData = new FormData();
    formData.append("file", audioBuffer, {
      filename: `audio.${ext}`,
      contentType: mimeType,
    });
    formData.append("model", "deepseek/deepseek-whisper");

    if (language) {
      formData.append("language", language);
    }

    if (prompt) {
      formData.append("prompt", prompt);
    }

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Voice] Transcription failed:", error);
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();

    console.log("[Voice] Transcription successful (base64)");

    return {
      text: result.text,
      language: result.language,
      duration: result.duration,
    };
  } catch (error) {
    console.error("[Voice] Transcription error (base64):", error);
    throw error;
  }
}

/**
 * Validate audio file size
 * OpenRouter has a 25MB limit for audio files
 */
export function validateAudioSize(sizeInBytes: number): boolean {
  const MAX_SIZE = 25 * 1024 * 1024; // 25MB
  return sizeInBytes <= MAX_SIZE;
}

/**
 * Validate audio format
 */
export function validateAudioFormat(mimeType: string): boolean {
  const supportedFormats = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/ogg",
    "audio/webm",
    "audio/mp4",
    "audio/x-m4a",
  ];

  return supportedFormats.includes(mimeType);
}
