import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "../lib/dayjs";

interface UserState {
  name: string;
  password: string;
  gender: "" | "L" | "P";
  targetSedekah: number;
  targetQuran: number;
  isAuthenticated: boolean;
  streak: number;
  lastStreakDate: string;
  login: (password: string) => boolean;
  logout: () => void;
  updateProfile: (
    data: Partial<
      Pick<
        UserState,
        "name" | "password" | "gender" | "targetSedekah" | "targetQuran"
      >
    >,
  ) => void;
  tryIncrementStreak: () => void;
}

type PersistedUserState = Partial<
  UserState & {
    pin?: string;
  }
>;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: "",
      password: "",
      gender: "",
      targetSedekah: 50000,
      targetQuran: 2,
      isAuthenticated: false,
      streak: 0,
      lastStreakDate: "",
      login: (password) => {
        const ok = get().password !== "" && get().password === password;
        if (ok) set({ isAuthenticated: true });
        return ok;
      },
      logout: () => set({ isAuthenticated: false }),
      updateProfile: (data) => set({ ...data }),
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
      version: 2,
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as PersistedUserState;

        return {
          ...state,
          password: state.password ?? state.pin ?? "",
          isAuthenticated: false,
        };
      },
    },
  ),
);
