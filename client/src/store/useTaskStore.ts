import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "../lib/dayjs";
import { useUserStore } from "./useUserStore";

type SholatStatus = "none" | "done" | "halangan";
type SholatKey = "s" | "d" | "a" | "m" | "i";

interface TaskDay {
  date: string;
  sholat: Record<SholatKey, SholatStatus>;
  dzikirPagi: boolean;
  dzikirPetang: boolean;
  quran: { pages: number; done: boolean };
  sedekah: { amount: number; done: boolean };
  custom: { id: string; name: string; done: boolean }[];
}

interface TaskState {
  days: Record<string, TaskDay>;
  getToday: () => TaskDay;
  toggleSholat: (key: SholatKey) => void;
  setSholatStatus: (key: SholatKey, status: SholatStatus) => void;
  setAllSholat: (status: SholatStatus) => void;
  toggleDzikir: (type: "pagi" | "petang") => void;
  setAllDzikir: (done: boolean) => void;
  setQuranPages: (pages: number) => void;
  toggleQuran: () => void;
  setSedekahAmount: (amount: number) => void;
  toggleSedekah: () => void;
  addCustom: (name: string) => void;
  toggleCustom: (id: string) => void;
  removeCustom: (id: string) => void;
  getWeeklySedekah: () => number;
  getTotalScore: () => number;
  syncUserScore: () => void;
}

const TASK_SCORE = 10;

const createToday = (date: string): TaskDay => ({
  date,
  sholat: { s: "none", d: "none", a: "none", m: "none", i: "none" },
  dzikirPagi: false,
  dzikirPetang: false,
  quran: { pages: 0, done: false },
  sedekah: { amount: 0, done: false },
  custom: [],
});

const getTaskDayScore = (day: TaskDay) => {
  const sholatScore =
    Object.values(day.sholat).filter((status) => status === "done").length *
    TASK_SCORE;
  const dzikirScore =
    (Number(day.dzikirPagi) + Number(day.dzikirPetang)) * TASK_SCORE;
  const quranScore = day.quran.done ? day.quran.pages * TASK_SCORE : 0;
  const sedekahScore = day.sedekah.done
    ? Math.floor(day.sedekah.amount / 1000) * TASK_SCORE
    : 0;
  const customScore =
    day.custom.filter((item) => item.done).length * TASK_SCORE;

  return sholatScore + dzikirScore + quranScore + sedekahScore + customScore;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      days: {},
      getToday: () => {
        const today = dayjs().format("YYYY-MM-DD");
        const days = get().days;
        if (!days[today]) {
          const newDay = createToday(today);
          set({ days: { ...days, [today]: newDay } });
          return newDay;
        }
        return days[today];
      },
      toggleSholat: (key) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const cur = day.sholat[key];
        const next: SholatStatus =
          cur === "none" ? "done" : cur === "done" ? "halangan" : "none";
        const updated = { ...day, sholat: { ...day.sholat, [key]: next } };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      setSholatStatus: (key, status) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, sholat: { ...day.sholat, [key]: status } };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      setAllSholat: (status) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = {
          ...day,
          sholat: { s: status, d: status, a: status, m: status, i: status },
        };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      toggleDzikir: (type) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const key = type === "pagi" ? "dzikirPagi" : "dzikirPetang";
        const updated = { ...day, [key]: !day[key] };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      setAllDzikir: (done) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, dzikirPagi: done, dzikirPetang: done };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      setQuranPages: (pages) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, quran: { ...day.quran, pages } };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      toggleQuran: () => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        if (day.quran.pages <= 0) return;
        const updated = {
          ...day,
          quran: { ...day.quran, done: !day.quran.done },
        };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      setSedekahAmount: (amount) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, sedekah: { ...day.sedekah, amount } };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      toggleSedekah: () => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        if (day.sedekah.amount <= 0) return;
        const updated = {
          ...day,
          sedekah: { ...day.sedekah, done: !day.sedekah.done },
        };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      addCustom: (name) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const id = Math.random().toString(36).slice(2);
        const updated = {
          ...day,
          custom: [...day.custom, { id, name, done: false }],
        };
        set({ days: { ...get().days, [today]: updated } });
      },
      toggleCustom: (id) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = {
          ...day,
          custom: day.custom.map((c) =>
            c.id === id ? { ...c, done: !c.done } : c,
          ),
        };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
        if (scoreDelta > 0) useUserStore.getState().tryIncrementStreak();
      },
      removeCustom: (id) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = {
          ...day,
          custom: day.custom.filter((c) => c.id !== id),
        };
        set({ days: { ...get().days, [today]: updated } });
        const scoreDelta = getTaskDayScore(updated) - getTaskDayScore(day);
        if (scoreDelta !== 0) useUserStore.getState().addScore(scoreDelta);
      },
      getWeeklySedekah: () => {
        const now = dayjs();
        let friday = now.day(5).startOf("day");
        if (now.isBefore(friday)) friday = friday.subtract(1, "week");
        let total = 0;
        Object.values(get().days).forEach((d) => {
          if (!dayjs(d.date).isBefore(friday, "day") && d.sedekah.done)
            total += d.sedekah.amount;
        });
        return total;
      },
      getTotalScore: () => {
        return Object.values(get().days).reduce(
          (total, day) => total + getTaskDayScore(day),
          0,
        );
      },
      syncUserScore: () => {
        useUserStore.getState().setScore(get().getTotalScore());
      },
    }),
    { name: "amal-tasks" },
  ),
);
