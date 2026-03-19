import { NextResponse } from "next/server";
import { z } from "zod";
import { textToSpeech } from "@/lib/elevenlabs";

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

const ttsRequestSchema = z.object({
  text: z.string().min(1).max(500),
  voiceId: z.string().optional(),
});

// In-memory LRU cache bounded to 200 entries
const LRU_MAX = 200;
const cache = new Map<string, ArrayBuffer>();

function lruGet(key: string): ArrayBuffer | undefined {
  const value = cache.get(key);
  if (value !== undefined) {
    // Move to end (most recently used)
    cache.delete(key);
    cache.set(key, value);
  }
  return value;
}

function lruSet(key: string, value: ArrayBuffer): void {
  if (cache.has(key)) {
    cache.delete(key);
  } else if (cache.size >= LRU_MAX) {
    // Evict oldest (first) entry
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) {
      cache.delete(oldest);
    }
  }
  cache.set(key, value);
}

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ttsRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { text, voiceId = DEFAULT_VOICE_ID } = parsed.data;
    const cacheKey = await sha256Hex(text + voiceId);

    // Check cache
    const cached = lruGet(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    const audioBuffer = await textToSpeech(text, voiceId);

    // Store in cache
    lruSet(cacheKey, audioBuffer);

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      {
        error: "Text-to-speech failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
