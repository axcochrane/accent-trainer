import { and, asc, count, eq, notInArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { accents, phonemeShifts, wordPhonemeShifts, words } from "@/db/schema";

// ── Types ─────────────────────────────────────────────────────────────────────

export type WordWithShifts = typeof words.$inferSelect & {
  wordPhonemeShifts: Array<{
    phonemeShift: typeof phonemeShifts.$inferSelect;
  }>;
};

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Get an accent by its ID.
 */
export async function getAccentById(accentId: string) {
  const result = await db.query.accents.findFirst({
    where: eq(accents.id, accentId),
  });
  return result ?? null;
}

/**
 * Get the next word for a user to practice.
 *
 * Orders by difficulty (ascending), then by creation time (as a proxy for
 * sort order within a difficulty level). Optionally filters by difficulty
 * and excludes already-practiced word IDs.
 */
export async function getNextWord(
  accentId: string,
  options?: { difficulty?: number; exclude?: string[] },
): Promise<WordWithShifts | null> {
  const conditions = [eq(words.accentId, accentId)];

  if (options?.difficulty !== undefined) {
    conditions.push(eq(words.difficulty, options.difficulty));
  }

  if (options?.exclude && options.exclude.length > 0) {
    conditions.push(notInArray(words.id, options.exclude));
  }

  const result = await db.query.words.findFirst({
    where: and(...conditions),
    orderBy: [asc(words.difficulty), asc(words.createdAt)],
    with: {
      wordPhonemeShifts: {
        with: {
          phonemeShift: true,
        },
      },
    },
  });

  return (result as WordWithShifts) ?? null;
}

/**
 * Get a paginated list of words for an accent, optionally filtered by
 * difficulty level.
 */
export async function getWords(
  accentId: string,
  filters?: { difficulty?: number; limit?: number; offset?: number },
) {
  const limit = filters?.limit ?? 20;
  const offset = filters?.offset ?? 0;

  const conditions = [eq(words.accentId, accentId)];

  if (filters?.difficulty !== undefined) {
    conditions.push(eq(words.difficulty, filters.difficulty));
  }

  const whereClause = and(...conditions);

  const [wordList, [totalResult]] = await Promise.all([
    db.query.words.findMany({
      where: whereClause,
      orderBy: [asc(words.difficulty), asc(words.createdAt)],
      limit,
      offset,
      with: {
        wordPhonemeShifts: {
          with: {
            phonemeShift: true,
          },
        },
      },
    }),
    db
      .select({ count: count() })
      .from(words)
      .where(whereClause),
  ]);

  return {
    words: wordList as WordWithShifts[],
    total: totalResult.count,
  };
}

/**
 * Count words at each difficulty level for an accent.
 * Used for progress tracking.
 */
export async function getWordCountsByDifficulty(accentId: string) {
  const results = await db
    .select({
      difficulty: words.difficulty,
      count: count(),
    })
    .from(words)
    .where(eq(words.accentId, accentId))
    .groupBy(words.difficulty)
    .orderBy(asc(words.difficulty));

  return results;
}
