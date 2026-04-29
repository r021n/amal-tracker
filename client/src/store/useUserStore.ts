import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "../lib/dayjs";

interface UserState {
  name: string;
  username: string;
  password: string;
  gender: "" | "L" | "P";
  targetSedekah: number;
  targetQuran: number;
  isAuthenticated: boolean;
  streak: number;
  score: number;
  lastStreakDate: string;
  register: (username: string, password: string) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserProfileFields>) => void;
  addScore: (amount: number) => void;
  setScore: (score: number) => void;
  tryIncrementStreak: () => void;
}

type UserProfileFields = Pick<
  UserState,
  "name" | "password" | "gender" | "targetSedekah" | "targetQuran"
>;

type PersistedUserState = Partial<
  Pick<
    UserState,
    | "name"
    | "username"
    | "password"
    | "gender"
    | "targetSedekah"
    | "targetQuran"
    | "isAuthenticated"
    | "streak"
    | "score"
    | "lastStreakDate"
  >
> & {
  pin?: string;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: "",
      username: "",
      password: "",
      gender: "",
      targetSedekah: 50000,
      targetQuran: 2,
      isAuthenticated: false,
      streak: 0,
      score: 0,
      lastStreakDate: "",
      register: (username, password) => {
        set({ username, password, isAuthenticated: true });
      },
      login: (username, password) => {
        const ok =
          get().username !== "" &&
          get().password !== "" &&
          get().username === username &&
          get().password === password;
        if (ok) set({ isAuthenticated: true });
        return ok;
      },
      logout: () => set({ isAuthenticated: false }),
      updateProfile: (data) => set({ ...data }),
      addScore: (amount) => {
        set((state) => ({ score: Math.max(0, state.score + amount) }));
      },
      setScore: (score) => {
        set({ score: Math.max(0, score) });
      },
      tryIncrementStreak: () => {
        const today = dayjs().format("YYYY-MM-DD");
        const { lastStreakDate, streak } = get();
        if (lastStreakDate === today) return;
        const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
        const newStreak = lastStreakDate === yesterday ? streak + 1 : 1;
        set({ streak: newStreak, lastStreakDate: today });
      },
    }),
    {
      name: "amal-user",
      version: 3,
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as PersistedUserState;
        const { pin, ...rest } = state;

        return {
          ...rest,
          username: state.username ?? "",
          password: state.password ?? pin ?? "",
          score: state.score ?? 0,
          isAuthenticated: false,
        };
      },
    },
  ),
);
