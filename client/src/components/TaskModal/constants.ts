export type SholatStatus = "none" | "done" | "halangan";
export type SholatKey = "s" | "d" | "a" | "m" | "i";

export const sholatItems = [
  { k: "s" as const, label: "Subuh", icon: "🌅" },
  { k: "d" as const, label: "Dzuhur", icon: "☀️" },
  { k: "a" as const, label: "Ashar", icon: "🌤️" },
  { k: "m" as const, label: "Maghrib", icon: "🌇" },
  { k: "i" as const, label: "Isya", icon: "🌙" },
] as const;

export const sedekahOptions = [1000, 2000, 5000, 10000, 20000, 50000, 100000];