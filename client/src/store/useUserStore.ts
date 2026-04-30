import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "../lib/dayjs";
import { apiFetch } from "../lib/api";

interface UserState {
  name: string;
  username: string;
  gender: "" | "L" | "P";
  targetSedekah: number;
  targetQuran: number;
  isAuthenticated: boolean;
  token: string | null;
  streak: number;
  score: number;
  lastStreakDate: string;
  register: (
    username: string,
    password: string,
    name?: string,
  ) => Promise<void>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updateProfile: (data: Partial<UserProfileFields>) => Promise<void>;
  addScore: (amount: number) => void;
  setScore: (score: number) => void;
  tryIncrementStreak: () => void;
}

type UserProfileFields = Pick<
  UserState,
  "name" | "gender" | "targetSedekah" | "targetQuran"
> & { password?: string };

type PersistedUserState = Partial<
  Pick<
    UserState,
    | "name"
    | "username"
    | "gender"
    | "targetSedekah"
    | "targetQuran"
    | "isAuthenticated"
    | "token"
    | "streak"
    | "score"
    | "lastStreakDate"
  >
> & {
  pin?: string;
  password?: string;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: "",
      username: "",
      gender: "",
      targetSedekah: 50000,
      targetQuran: 2,
      isAuthenticated: false,
      token: null,
      streak: 0,
      score: 0,
      lastStreakDate: "",
      register: async (username, password, name = "Kawan") => {
        const res = await apiFetch<{
          token: string;
          user: { username: string; name: string };
        }>("/auth/register", {
          method: "POST",
          body: { username, password, name },
        });
        set({
          token: res.token,
          username: res.user.username,
          name: res.user.name,
          isAuthenticated: true,
        });
      },
      login: async (username, password) => {
        try {
          const res = await apiFetch<{
            token: string;
            user: { username: string; name: string };
          }>("/auth/login", {
            method: "POST",
            body: { username, password },
          });
          set({
            token: res.token,
            username: res.user.username,
            name: res.user.name,
            isAuthenticated: true,
          });
          return true;
        } catch {
          return false;
        }
      },
      logout: () => set({ isAuthenticated: false, token: null }),
      fetchMe: async () => {
        try {
          const res = await apiFetch<{ user: Partial<UserState> }>("/auth/me");
          if (res.user) {
            set({
              name: res.user.name,
              username: res.user.username,
              gender: res.user.gender ?? "",
              targetSedekah: res.user.targetSedekah ?? 50000,
              targetQuran: res.user.targetQuran ?? 2,
              score: res.user.score ?? 0,
              streak: res.user.streak ?? 0,
              lastStreakDate: res.user.lastStreakDate ?? "",
              isAuthenticated: true,
            });
          }
        } catch (e) {
          console.error("Gagal mendapatkan profile", e);
          set({ isAuthenticated: false, token: null });
        }
      },
      updateProfile: async (data) => {
        set({ ...data });
        try {
          await apiFetch("/profile", {
            method: "PUT",
            body: data,
          });
        } catch (e) {
          console.error("Gagal update profile", e);
        }
      },
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
        const rest = { ...state };
        delete rest.pin;
        delete rest.password;

        return {
          ...rest,
          username: state.username ?? "",
          score: state.score ?? 0,
          isAuthenticated: !!state.token,
          token: state.token ?? null,
        };
      },
    },
  ),
);
