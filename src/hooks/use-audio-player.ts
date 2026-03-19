"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAudioPlayerReturn {
  isPlaying: boolean;
  play: (url: string) => void;
  stop: () => void;
  analyserNode: AnalyserNode | null;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const ensureAudioSetup = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";

      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener("error", () => {
        setIsPlaying(false);
      });
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaElementSource(
        audioRef.current,
      );
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);
      analyser.connect(audioContextRef.current.destination);

      sourceRef.current = source;
      analyserRef.current = analyser;
      setAnalyserNode(analyser);
    }
  }, []);

  const play = useCallback(
    (url: string) => {
      ensureAudioSetup();

      const audio = audioRef.current;
      if (!audio) return;

      // Resume AudioContext if suspended (browser autoplay policy)
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }

      audio.src = url;
      audio.play();
      setIsPlaying(true);
    },
    [ensureAudioSetup],
  );

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current = null;
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      sourceRef.current = null;
      analyserRef.current = null;
    };
  }, []);

  return {
    isPlaying,
    play,
    stop,
    analyserNode,
  };
}
