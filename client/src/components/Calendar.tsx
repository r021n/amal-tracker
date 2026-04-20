import { useState } from "react";
import dayjs from "../lib/dayjs";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";

export default function Calendar() {
  const [mode, setMode] = useState<"hijri" | "gregory">("hijri");
  const days = useTaskStore(useShallow((s) => s.days));
  const todayStr = dayjs().format("YYYY-MM-DD");
  const start = dayjs().startOf("month");
  const count = dayjs().daysInMonth();

  const hasKebaikan = (dateStr: string) => {
    const d = days[dateStr];
    if (!d) return false;
    return (
      Object.values(d.sholat).some((v) => v === "done") ||
      d.dzikirPagi ||
      d.dzikirPetang ||
      d.quran.done ||
      d.sedekah.done ||
      d.custom.some((c) => c.done)
    );
  };

  return (
    <div>
      <div className="flex gap-4 mb-2">
        <button
          onClick={() => setMode("hijri")}
          className={mode === "hijri" ? "font-medium" : "text-gray-400"}
        >
          Hijriah
        </button>
        <button
          onClick={() => setMode("gregory")}
          className={mode === "gregory" ? "font-medium" : "text-gray-400"}
        >
          Masehi
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: count }).map((_, i) => {
          const date = start.add(i, "day");
          const dateStr = date.format("YYYY-MM-DD");
          const isToday = dateStr === todayStr;
          const kebaikan = hasKebaikan(dateStr);
          const label =
            mode === "hijri"
              ? date.calendar("hijri").format("D")
              : date.format("D");
          const bg = isToday
            ? "bg-green-500 text-white"
            : kebaikan
              ? "bg-orange-400 text-white"
              : "bg-gray-100";
          return (
            <div
              key={dateStr}
              className={`h-8 grid place-items-center rounded ${bg}`}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
