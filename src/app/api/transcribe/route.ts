import { NextResponse } from "next/server";
import { speechToText } from "@/lib/elevenlabs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid audio file" },
        { status: 400 },
      );
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const text = await speechToText(audioBuffer);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      {
        error: "Transcription failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
