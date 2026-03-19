"use client";

import { Check, X, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EvaluationResult as EvaluationResultType } from "@/lib/schemas/evaluation";
import { cn } from "@/lib/utils";

interface EvaluationResultProps {
  result: EvaluationResultType;
  onTryAgain: () => void;
  onNextWord: () => void;
}

const scoreColor = (score: number) => {
  switch (score) {
    case 1:
      return "bg-red-500 text-white";
    case 2:
      return "bg-orange-500 text-white";
    case 3:
      return "bg-yellow-500 text-white";
    case 4:
      return "bg-green-500 text-white";
    case 5:
      return "bg-amber-400 text-black";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const scoreLabel = (score: number) => {
  switch (score) {
    case 1:
      return "Missed";
    case 2:
      return "Needs Work";
    case 3:
      return "Passing";
    case 4:
      return "Great";
    case 5:
      return "Perfect";
    default:
      return "Unknown";
  }
};

export function EvaluationResult({
  result,
  onTryAgain,
  onNextWord,
}: EvaluationResultProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Evaluation</CardTitle>
          <Badge className={cn("text-lg px-3 py-1", scoreColor(result.score))}>
            {result.score}/5 - {scoreLabel(result.score)}
          </Badge>
        </div>
        <div className="text-sm font-medium">
          {result.passed ? (
            <span className="text-green-600 dark:text-green-400">
              Passed!
            </span>
          ) : (
            <span className="text-orange-600 dark:text-orange-400">
              Needs more practice
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{result.feedback}</p>

        {result.phonemeResults.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold">Phoneme Breakdown</h4>
            <ul className="flex flex-col gap-1.5">
              {result.phonemeResults.map((pr) => (
                <li key={pr.shift} className="flex items-start gap-2 text-sm">
                  {pr.hit ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-green-500" />
                  ) : (
                    <X className="mt-0.5 size-4 shrink-0 text-red-500" />
                  )}
                  <div>
                    <span className="font-medium">{pr.shift}</span>
                    <span className="text-muted-foreground"> - {pr.tip}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-md bg-muted px-3 py-2">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <p className="text-sm">{result.nextTip}</p>
        </div>
      </CardContent>

      <CardFooter className="gap-3">
        <Button variant="outline" onClick={onTryAgain}>
          Try Again
        </Button>
        <Button onClick={onNextWord}>Next Word</Button>
      </CardFooter>
    </Card>
  );
}
