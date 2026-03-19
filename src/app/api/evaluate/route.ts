import { NextResponse } from "next/server";
import { EvaluateRequestSchema } from "@/lib/schemas/evaluation";
import { evaluatePronunciation } from "@/lib/evaluation/evaluate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = EvaluateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = await evaluatePronunciation(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      {
        error: "Evaluation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
