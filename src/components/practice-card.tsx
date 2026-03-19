"use client";

import { useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListenButton } from "@/components/listen-button";
import { RecordButton } from "@/components/record-button";
import { AudioWaveform } from "@/components/audio-waveform";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

interface Word {
  id: string;
  text: string;
  ipaStandard?: string;
  ipaAccent?: string;
  pronunciationCue?: string;
  difficulty: number;
}

interface PracticeCardProps {
  word: Word;
  onTranscriptionComplete?: (text: string) => void;
}

const difficultyLabel = (level: number) => {
  if (level <= 1) return "Easy";
  if (level <= 2) return "Medium";
  return "Hard";
};

const difficultyVariant = (level: number) => {
  if (level <= 1) return "secondary" as const;
  if (level <= 2) return "outline" as const;
  return "destructive" as const;
};

export function PracticeCard({ word, onTranscriptionComplete }: PracticeCardProps) {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { analyserNode, isRecording } = useAudioRecorder();

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      setIsTranscribing(true);
      setTranscription(null);

      try {
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Transcription failed");
        }

        const data = await response.json();
        setTranscription(data.text);
        onTranscriptionComplete?.(data.text);
      } catch (error) {
        console.error("Transcription error:", error);
        setTranscription("Failed to transcribe. Please try again.");
      } finally {
        setIsTranscribing(false);
      }
    },
    [onTranscriptionComplete],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-3xl font-bold">{word.text}</CardTitle>
          <Badge variant={difficultyVariant(word.difficulty)}>
            {difficultyLabel(word.difficulty)}
          </Badge>
        </div>
        {(word.ipaStandard || word.ipaAccent) && (
          <div className="flex gap-3 text-sm text-muted-foreground">
            {word.ipaStandard && <span>Standard: {word.ipaStandard}</span>}
            {word.ipaAccent && <span>Accent: {word.ipaAccent}</span>}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {word.pronunciationCue && (
          <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            {word.pronunciationCue}
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <ListenButton text={word.text} />
          <RecordButton onRecordingComplete={handleRecordingComplete} />
        </div>

        <AudioWaveform analyserNode={analyserNode} isActive={isRecording} />

        {isTranscribing && (
          <div className="text-center text-sm text-muted-foreground">
            Transcribing...
          </div>
        )}

        {transcription && (
          <div className="rounded-md border px-3 py-2 text-center text-sm">
            <span className="text-muted-foreground">You said: </span>
            <span className="font-medium">{transcription}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
