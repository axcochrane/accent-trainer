import { type AnthropicProvider, createAnthropic } from "@ai-sdk/anthropic";

let _anthropic: AnthropicProvider | null = null;

export function getAnthropic(): AnthropicProvider {
  if (!_anthropic) {
    _anthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _anthropic;
}

/** Route to a more capable model for harder evaluations. */
export function getEvaluationModel(difficulty: number) {
  const anthropic = getAnthropic();
  return difficulty >= 3
    ? anthropic("claude-sonnet-4-5-20250514")
    : anthropic("claude-haiku-4-5-20251001");
}
