import { create } from "zustand";

interface AudioState {
  isPlaying: boolean;
  isRecording: boolean;
  currentAudioUrl: string | null;
  recordedBlob: Blob | null;
  transcription: string | null;
  setPlaying: (playing: boolean) => void;
  setRecording: (recording: boolean) => void;
  setCurrentAudioUrl: (url: string | null) => void;
  setRecordedBlob: (blob: Blob | null) => void;
  setTranscription: (transcription: string | null) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>()((set) => ({
  isPlaying: false,
  isRecording: false,
  currentAudioUrl: null,
  recordedBlob: null,
  transcription: null,
  setPlaying: (playing) => set({ isPlaying: playing }),
  setRecording: (recording) => set({ isRecording: recording }),
  setCurrentAudioUrl: (url) => set({ currentAudioUrl: url }),
  setRecordedBlob: (blob) => set({ recordedBlob: blob }),
  setTranscription: (transcription) => set({ transcription }),
  reset: () =>
    set({
      isPlaying: false,
      isRecording: false,
      currentAudioUrl: null,
      recordedBlob: null,
      transcription: null,
    }),
}));
