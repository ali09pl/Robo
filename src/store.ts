import { create } from 'zustand';
import type { User, UserProgress } from './types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  userProgress: UserProgress[];
  loading: boolean;
  error: string | null;
  
  // User actions
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  updateUserXP: (xp: number) => void;
  updateUserStreak: (streak: number) => void;
  updateUserHearts: (hearts: number) => void;
  
  // Progress actions
  setUserProgress: (progress: UserProgress[]) => void;
  addProgress: (progress: UserProgress) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Logout
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  userProgress: [],
  loading: false,
  error: null,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  
  updateUserXP: (xp) => set((state) => ({
    user: state.user ? { ...state.user, xp: state.user.xp + xp, totalXP: state.user.totalXP + xp } : null,
  })),
  
  updateUserStreak: (streak) => set((state) => ({
    user: state.user ? { ...state.user, streak } : null,
  })),
  
  updateUserHearts: (hearts) => set((state) => ({
    user: state.user ? { ...state.user, hearts } : null,
  })),
  
  setUserProgress: (progress) => set({ userProgress: progress }),
  addProgress: (progress) => set((state) => ({
    userProgress: [...state.userProgress, progress],
  })),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  logout: () => set({ user: null, isAuthenticated: false, userProgress: [] }),
}));
