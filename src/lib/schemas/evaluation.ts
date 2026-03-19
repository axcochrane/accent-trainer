import { z } from "zod";

export const PhonemeResultSchema = z.object({
  shift: z.string(),
  hit: z.boolean(),
  tip: z.string(),
});

export const EvaluationResultSchema = z.object({
  score: z.number().min(1).max(5),
  passed: z.boolean(),
  feedback: z.string(),
  phonemeResults: z.array(PhonemeResultSchema),
  nextTip: z.string(),
});

export const EvaluateRequestSchema = z.object({
  targetWord: z.string(),
  userTranscription: z.string(),
  difficulty: z.number().min(1).max(5),
  phonemeShifts: z.array(
    z.object({
      label: z.string(),
      description: z.string(),
      example: z.string(),
    }),
  ),
});

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
export type EvaluateRequest = z.infer<typeof EvaluateRequestSchema>;
