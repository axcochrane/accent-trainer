import { create } from "zustand";

interface SessionState {
  selectedAccentId: string | null;
  activeWordId: string | null;
  sessionStartedAt: Date | null;
  setSelectedAccent: (id: string | null) => void;
  setActiveWord: (id: string | null) => void;
  startSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  selectedAccentId: null,
  activeWordId: null,
  sessionStartedAt: null,
  setSelectedAccent: (id) => set({ selectedAccentId: id }),
  setActiveWord: (id) => set({ activeWordId: id }),
  startSession: () => set({ sessionStartedAt: new Date() }),
}));
