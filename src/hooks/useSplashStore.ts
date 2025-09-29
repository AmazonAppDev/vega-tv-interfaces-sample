import { create } from 'zustand';

type SplashState = {
  splashDone: boolean;
  setSplashDone: () => void;
};

export const useSplashStore = create<SplashState>(set => ({
  splashDone: false,
  setSplashDone: () => set({ splashDone: true }),
}));
