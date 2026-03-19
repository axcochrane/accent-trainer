"use client";

import { useCallback, useEffect, useRef } from "react";

interface AudioWaveformProps {
  analyserNode: AnalyserNode | null;
  isActive: boolean;
}

export function AudioWaveform({ analyserNode, isActive }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserNode) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      const barCount = Math.min(bufferLength, 64);
      const barWidth = width / barCount;
      const gap = 1;

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i] ?? 0;
        const barHeight = (value / 255) * height;
        const x = i * barWidth;

        ctx.fillStyle = isActive
          ? `hsl(var(--primary) / ${0.4 + (value / 255) * 0.6})`
          : `hsl(var(--muted-foreground) / ${0.2 + (value / 255) * 0.3})`;

        ctx.fillRect(
          x + gap / 2,
          height - barHeight,
          barWidth - gap,
          barHeight,
        );
      }
    };

    render();
  }, [analyserNode, isActive]);

  useEffect(() => {
    if (analyserNode && isActive) {
      draw();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Clear canvas when inactive
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [analyserNode, isActive, draw]);

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={64}
      className="h-16 w-full rounded-md"
    />
  );
}
