"use client";

import { useCallback, useRef } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { cn } from "@/lib/utils";

interface RecordButtonProps {
  onRecordingComplete: (blob: Blob) => void;
}

export function RecordButton({ onRecordingComplete }: RecordButtonProps) {
  const { isRecording, startRecording, stopRecording, duration, error } =
    useAudioRecorder();
  const isStoppingRef = useRef(false);

  const handlePointerDown = useCallback(async () => {
    if (isRecording || isStoppingRef.current) return;
    await startRecording();
  }, [isRecording, startRecording]);

  const handlePointerUp = useCallback(async () => {
    if (!isRecording || isStoppingRef.current) return;
    isStoppingRef.current = true;
    try {
      const blob = await stopRecording();
      onRecordingComplete(blob);
    } catch (err) {
      console.error("Stop recording error:", err);
    } finally {
      isStoppingRef.current = false;
    }
  }, [isRecording, stopRecording, onRecordingComplete]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 -m-1 animate-pulse rounded-full bg-destructive/20" />
        )}
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="icon-lg"
          className={cn("rounded-full")}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={isRecording ? handlePointerUp : undefined}
          onTouchStart={handlePointerDown}
          onTouchEnd={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Mic />
        </Button>
      </div>
      {isRecording && (
        <span className="text-sm tabular-nums text-muted-foreground">
          {duration.toFixed(1)}s
        </span>
      )}
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
