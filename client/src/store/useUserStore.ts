import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "dayjs";

interface UserState {
  name: string;
  pin: string;
  gender: "" | "L" | "P";
  targetSedekah: number;
  targetQuran: number;
  isAuthenticated: boolean;
  streak: number;
  lastStreakDate: string;
  login: (pin: string) => boolean;
  logout: () => void;
  updateProfile: (
    data: Partial<
      Pick<
        UserState,
        "name" | "pin" | "gender" | "targetSedekah" | "targetQuran"
      >
    >,
  ) => void;
  tryIncrementStreak: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: "",
      pin: "",
      gender: "",
      targetSedekah: 50000,
      targetQuran: 2,
      isAuthenticated: false,
      streak: 0,
      lastStreakDate: "",
      login: (pin) => {
        const ok = get().pin !== "" && get().pin === pin;
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
    { name: "amal-user" },
  ),
);
