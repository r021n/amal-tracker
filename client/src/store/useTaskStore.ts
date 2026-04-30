import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs from "../lib/dayjs";
import { useUserStore } from "./useUserStore";
import { apiFetch } from "../lib/api";

type SholatStatus = "none" | "done" | "halangan";
type SholatKey = "s" | "d" | "a" | "m" | "i";

interface TaskDay {
  date: string;
  sholat: Record<SholatKey, SholatStatus>;
  dzikirPagi: boolean;
  dzikirPetang: boolean;
  quran: { pages: number; done: boolean };
  sedekah: { amount: number; done: boolean };
  custom: { id: string | number; name: string; done: boolean }[];
}

interface TaskState {
  days: Record<string, TaskDay>;
  weeklySedekahTotal: number;
  fetchToday: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchWeeklySedekah: () => Promise<void>;
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
  toggleCustom: (id: string | number) => void;
  removeCustom: (id: string | number) => void;
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
      weeklySedekahTotal: 0,
      fetchToday: async () => {
        try {
          const res = await apiFetch<{ taskDay: TaskDay }>("/tasks/today");

          if (!res || !res.taskDay) return;

          const date = dayjs().format("YYYY-MM-DD");
          set({ days: { ...get().days, [date]: res.taskDay } });
          get().fetchWeeklySedekah();
        } catch (e) {
          console.error("Gagal load hari ini", e);
        }
      },
      fetchHistory: async () => {
        try {
          const res = await apiFetch<{ days: TaskDay[] }>("/tasks/history");
          if (!res || !res.days) return;

          const newDays = { ...get().days };
          res.days.forEach((day) => {
            newDays[day.date] = day;
          });
          set({ days: newDays });
        } catch (e) {
          console.error("Gagal load history", e);
        }
      },
      fetchWeeklySedekah: async () => {
        try {
          const res = await apiFetch<{ total: number }>(
            "/tasks/weekly-sedekah",
          );
          if (res) {
            set({ weeklySedekahTotal: res.total });
          }
        } catch (e) {
          console.error("Gagal load weekly sedekah", e);
        }
      },
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
      toggleSholat: async (key) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const cur = day.sholat[key];
        const next: SholatStatus =
          cur === "none" ? "done" : cur === "done" ? "halangan" : "none";
        const updated = { ...day, sholat: { ...day.sholat, [key]: next } };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/sholat", {
            method: "PUT",
            body: { key, status: next },
          });
          useUserStore.getState().fetchMe();
        } catch {
          // Revert optimis UI
          set({ days: { ...get().days, [today]: day } });
        }
      },
      setSholatStatus: async (key, status) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, sholat: { ...day.sholat, [key]: status } };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/sholat", {
            method: "PUT",
            body: { key, status },
          });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      setAllSholat: async (status) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = {
          ...day,
          sholat: { s: status, d: status, a: status, m: status, i: status },
        };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/sholat/all", {
            method: "PUT",
            body: { status },
          });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      toggleDzikir: async (type) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const key = type === "pagi" ? "dzikirPagi" : "dzikirPetang";
        const updated = { ...day, [key]: !day[key] };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/dzikir", {
            method: "PUT",
            body: { type },
          });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      setAllDzikir: async (done) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, dzikirPagi: done, dzikirPetang: done };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/dzikir/all", {
            method: "PUT",
            body: { done },
          });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      setQuranPages: async (pages) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, quran: { ...day.quran, pages } };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/quran", {
            method: "PUT",
            body: { pages },
          });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      toggleQuran: async () => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        if (day.quran.pages <= 0) return;
        const updated = {
          ...day,
          quran: { ...day.quran, done: !day.quran.done },
        };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/quran/toggle", { method: "PUT" });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      setSedekahAmount: async (amount) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = { ...day, sedekah: { ...day.sedekah, amount } };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/sedekah", {
            method: "PUT",
            body: { amount },
          });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      toggleSedekah: async () => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        if (day.sedekah.amount <= 0) return;
        const updated = {
          ...day,
          sedekah: { ...day.sedekah, done: !day.sedekah.done },
        };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch("/tasks/sedekah/toggle", { method: "PUT" });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      addCustom: async (name) => {
        try {
          const res = await apiFetch<{
            id: number;
            name: string;
            done: boolean;
            taskDayId: number;
          }>("/tasks/custom", {
            method: "POST",
            body: { name },
          });

          if (res) {
            get().fetchToday(); // Reload to get proper ID and stats
          }
        } catch (e) {
          console.error(e);
        }
      },
      toggleCustom: async (id) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = {
          ...day,
          custom: day.custom.map((c) =>
            c.id === id ? { ...c, done: !c.done } : c,
          ),
        };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch(`/tasks/custom/${id}/toggle`, { method: "PUT" });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
      },
      removeCustom: async (id) => {
        const today = dayjs().format("YYYY-MM-DD");
        const day = get().getToday();
        const updated = {
          ...day,
          custom: day.custom.filter((c) => c.id !== id),
        };
        set({ days: { ...get().days, [today]: updated } });

        try {
          await apiFetch(`/tasks/custom/${id}`, { method: "DELETE" });
          useUserStore.getState().fetchMe();
        } catch {
          set({ days: { ...get().days, [today]: day } });
        }
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
