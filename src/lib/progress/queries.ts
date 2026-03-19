import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { userProgress } from "@/db/schema";

export async function recordAttempt(
  userId: string,
  wordId: string,
  accentId: string,
  score: number,
) {
  const existing = await db.query.userProgress.findFirst({
    where: and(
      eq(userProgress.userId, userId),
      eq(userProgress.wordId, wordId),
    ),
  });

  if (existing) {
    const newBestScore = Math.max(existing.bestScore, score);
    const newMastered =
      existing.mastered || (score >= 4 && existing.bestScore >= 4);

    await db
      .update(userProgress)
      .set({
        attempts: existing.attempts + 1,
        bestScore: newBestScore,
        mastered: newMastered,
        lastAttemptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userProgress.id, existing.id));
  } else {
    await db.insert(userProgress).values({
      userId,
      wordId,
      accentId,
      attempts: 1,
      bestScore: score,
      mastered: false,
      lastAttemptedAt: new Date(),
    });
  }
}

export async function getOverallStats(userId: string, accentId: string) {
  const progress = await db.query.userProgress.findMany({
    where: and(
      eq(userProgress.userId, userId),
      eq(userProgress.accentId, accentId),
    ),
  });

  const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
  const wordsMastered = progress.filter((p) => p.mastered).length;
  const averageScore =
    progress.length > 0
      ? progress.reduce((sum, p) => sum + p.bestScore, 0) / progress.length
      : 0;

  return {
    totalAttempts,
    wordsMastered,
    averageScore,
    totalWords: progress.length,
  };
}

export async function getUserProgressForAccent(
  userId: string,
  accentId: string,
) {
  return db.query.userProgress.findMany({
    where: and(
      eq(userProgress.userId, userId),
      eq(userProgress.accentId, accentId),
    ),
    with: {
      word: true,
    },
  });
}
