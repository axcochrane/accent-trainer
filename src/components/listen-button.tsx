"use client";

import { useCallback, useRef, useState } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface ListenButtonProps {
  text: string;
  voiceId?: string;
}

export function ListenButton({ text, voiceId }: ListenButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isPlaying, play, stop } = useAudioPlayer();
  const blobUrlRef = useRef<string | null>(null);

  const handleClick = useCallback(async () => {
    if (isPlaying) {
      stop();
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const blob = await response.blob();

      // Revoke previous blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }

      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      play(url);
    } catch (error) {
      console.error("Listen error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [text, voiceId, isPlaying, play, stop]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Volume2 className={isPlaying ? "animate-pulse" : ""} />
      )}
      {isLoading ? "Loading..." : isPlaying ? "Playing" : "Listen"}
    </Button>
  );
}
