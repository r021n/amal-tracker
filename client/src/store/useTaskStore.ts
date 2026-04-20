import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "dayjs";
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
  toggleDzikir: (type: "pagi" | "petang") => void;
  setQuranPages: (pages: number) => void;
  toggleQuran: () => void;
  setSedekahAmount: (amount: number) => void;
  toggleSedekah: () => void;
  addCustom: (name: string) => void;
  toggleCustom: (id: string) => void;
  getWeeklySedekah: () => number;
}

const createToday = (date: string): TaskDay => ({
  date,
  sholat: { s: "none", d: "none", a: "none", m: "none", i: "none" },
  dzikirPagi: false,
  dzikirPetang: false,
  quran: { pages: 0, done: false },
  sedekah: { amount: 0, done: false },
  custom: [],
});

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
        if (next === "done") useUserStore.getState().tryIncrementStreak();
      },
      toggleDzikir: (type) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const key = type === "pagi" ? "dzikirPagi" : "dzikirPetang";
        const updated = { ...day, [key]: !day[key] };
        set({ days: { ...get().days, [today]: updated } });
        if (updated[key]) useUserStore.getState().tryIncrementStreak();
      },
      setQuranPages: (pages) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, quran: { ...day.quran, pages } };
        set({ days: { ...get().days, [today]: updated } });
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
        if (updated.quran.done) useUserStore.getState().tryIncrementStreak();
      },
      setSedekahAmount: (amount) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, sedekah: { ...day.sedekah, amount } };
        set({ days: { ...get().days, [today]: updated } });
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
        if (updated.sedekah.done) useUserStore.getState().tryIncrementStreak();
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
        if (updated.custom.some((c) => c.done))
          useUserStore.getState().tryIncrementStreak();
      },
      getWeeklySedekah: () => {
        const now = dayjs();
        let friday = now.day(5).hour(18).minute(0).second(0);
        if (now.isBefore(friday)) friday = friday.subtract(1, "week");
        let total = 0;
        Object.values(get().days).forEach((d) => {
          if (dayjs(d.date).isAfter(friday) && d.sedekah.done)
            total += d.sedekah.amount;
        });
        return total;
      },
    }),
    { name: "amal-tasks" },
  ),
);
