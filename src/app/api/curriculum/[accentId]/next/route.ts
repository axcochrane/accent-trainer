import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAccentById, getNextWord, getWordCountsByDifficulty } from "@/lib/curriculum/queries";

const searchParamsSchema = z.object({
  difficulty: z
    .string()
    .transform((v) => Number.parseInt(v, 10))
    .pipe(z.number().int().min(1).max(5))
    .optional(),
  exclude: z
    .string()
    .transform((v) => v.split(",").filter(Boolean))
    .optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accentId: string }> },
) {
  const { accentId } = await params;

  // Validate accent exists
  const accent = await getAccentById(accentId);
  if (!accent) {
    return NextResponse.json(
      { error: "Accent not found" },
      { status: 404 },
    );
  }

  // Parse and validate query params
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = searchParamsSchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { difficulty, exclude } = parsed.data;

  // Get next word
  const word = await getNextWord(accentId, { difficulty, exclude });

  if (!word) {
    return NextResponse.json(
      { error: "No more words available at this level" },
      { status: 404 },
    );
  }

  // Get progress info
  const difficultyCounts = await getWordCountsByDifficulty(accentId);
  const currentLevelCount = difficultyCounts.find(
    (d) => d.difficulty === word.difficulty,
  );
  const excludedAtLevel = (exclude ?? []).length;

  return NextResponse.json({
    word,
    progress: {
      currentLevel: word.difficulty,
      wordsAtLevel: currentLevelCount?.count ?? 0,
      completed: excludedAtLevel,
    },
  });
}
