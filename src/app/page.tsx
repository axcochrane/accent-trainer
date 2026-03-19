"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PracticeCard } from "@/components/practice-card";
import { EvaluationResult } from "@/components/evaluation-result";
import { StreakCounter } from "@/components/streak-counter";
import type { EvaluationResult as EvaluationResultType } from "@/lib/schemas/evaluation";

// Hardcoded Scottish accent ID for MVP — matches seed data
const SCOTTISH_ACCENT_ID = "scottish";

type PracticePhase =
  | "idle"
  | "recording"
  | "transcribing"
  | "evaluating"
  | "result";

interface WordData {
  id: string;
  text: string;
  ipaStandard?: string;
  ipaAccent?: string;
  pronunciationCue?: string;
  difficulty: number;
  wordPhonemeShifts: Array<{
    phonemeShift: {
      id: string;
      fromSound: string;
      toSound: string;
      description: string | null;
      exampleWord: string | null;
    };
  }>;
}

export default function HomePage() {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<PracticePhase>("idle");
  const [evaluation, setEvaluation] = useState<EvaluationResultType | null>(
    null,
  );
  const [streak, setStreak] = useState(0);
  const [practicedWordIds, setPracticedWordIds] = useState<string[]>([]);

  // Fetch next word
  const {
    data: wordData,
    isLoading: wordLoading,
    error: wordError,
  } = useQuery<{ word: WordData; progress: { currentLevel: number; wordsAtLevel: number; completed: number } }>({
    queryKey: ["nextWord", SCOTTISH_ACCENT_ID, practicedWordIds],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (practicedWordIds.length > 0) {
        params.set("exclude", practicedWordIds.join(","));
      }
      const res = await fetch(
        `/api/curriculum/${SCOTTISH_ACCENT_ID}/next?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Failed to fetch word");
      return res.json();
    },
  });

  const word = wordData?.word ?? null;

  // Evaluation mutation
  const evaluateMutation = useMutation({
    mutationFn: async (transcription: string) => {
      if (!word) throw new Error("No word to evaluate");

      const phonemeShifts = word.wordPhonemeShifts.map((wps) => ({
        label: `${wps.phonemeShift.fromSound} -> ${wps.phonemeShift.toSound}`,
        description: wps.phonemeShift.description ?? "Phoneme shift",
        example: wps.phonemeShift.exampleWord ?? word.text,
      }));

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetWord: word.text,
          userTranscription: transcription,
          difficulty: word.difficulty,
          phonemeShifts,
        }),
      });

      if (!res.ok) throw new Error("Evaluation failed");
      return res.json() as Promise<EvaluationResultType>;
    },
    onSuccess: (result) => {
      setEvaluation(result);
      setPhase("result");
      if (result.passed) {
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }
    },
    onError: () => {
      setPhase("idle");
    },
  });

  const handleTranscriptionComplete = useCallback(
    (transcription: string) => {
      setPhase("evaluating");
      evaluateMutation.mutate(transcription);
    },
    [evaluateMutation],
  );

  const handleTryAgain = useCallback(() => {
    setEvaluation(null);
    setPhase("idle");
  }, []);

  const handleNextWord = useCallback(() => {
    if (word) {
      setPracticedWordIds((prev) => [...prev, word.id]);
    }
    setEvaluation(null);
    setPhase("idle");
    queryClient.invalidateQueries({ queryKey: ["nextWord"] });
  }, [word, queryClient]);

  if (wordLoading) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (wordError || !word) {
    return (
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-4 p-8">
        <h2 className="text-2xl font-bold">No words available</h2>
        <p className="text-muted-foreground">
          {practicedWordIds.length > 0
            ? "You've practiced all available words! Great job!"
            : "Could not load practice words. Check your connection and try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-muted-foreground">
          Practice
        </h2>
        <StreakCounter streak={streak} />
      </div>

      {phase !== "result" ? (
        <>
          <PracticeCard
            word={word}
            onTranscriptionComplete={handleTranscriptionComplete}
          />
          {phase === "evaluating" && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Evaluating your pronunciation...
            </div>
          )}
        </>
      ) : (
        evaluation && (
          <EvaluationResult
            result={evaluation}
            onTryAgain={handleTryAgain}
            onNextWord={handleNextWord}
          />
        )
      )}
    </div>
  );
}
