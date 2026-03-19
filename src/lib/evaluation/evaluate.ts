import { generateText, Output } from "ai";
import { getEvaluationModel } from "@/lib/ai";
import {
  EvaluationResultSchema,
  type EvaluateRequest,
  type EvaluationResult,
} from "@/lib/schemas/evaluation";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

export async function evaluatePronunciation(
  request: EvaluateRequest,
): Promise<EvaluationResult> {
  const model = getEvaluationModel(request.difficulty);

  const { output } = await generateText({
    model,
    output: Output.object({ schema: EvaluationResultSchema }),
    system: buildSystemPrompt(request.phonemeShifts),
    prompt: buildUserPrompt(request.targetWord, request.userTranscription),
  });

  if (!output) {
    throw new Error("Failed to generate evaluation");
  }

  return output;
}
