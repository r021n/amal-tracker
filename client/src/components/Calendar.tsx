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

  const isPerfectDay = (dateStr: string) => {
    const d = days[dateStr];
    if (!d) return false;
    const sholatComplete = Object.values(d.sholat).every((v) => v !== "none");
    return (
      sholatComplete &&
      d.dzikirPagi &&
      d.dzikirPetang &&
      d.quran.done &&
      d.sedekah.done
    );
  };

  const perfectDays = Array.from({ length: count }).filter((_, i) => {
    const dateStr = start.add(i, "day").format("YYYY-MM-DD");
    return isPerfectDay(dateStr);
  }).length;

  const monthLabel =
    mode === "hijri"
      ? dayjs().calendar("hijri").format("MMMM YYYY [H]")
      : dayjs().format("MMMM YYYY");

  return (
    <div className="rounded-[26px] border-2 border-black bg-stone-50 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold leading-none">Calendar</h2>
          <p className="mt-1 text-sm text-gray-500">Ibadah streak</p>
          <p className="mt-5 text-sm text-gray-500">Hari sempurna</p>
          <p className="text-3xl font-black">
            {perfectDays}{" "}
            <span className="text-xl font-semibold text-gray-600">
              / {count}
            </span>
          </p>
        </div>

        <div className="rounded-full border-2 border-black p-1 bg-white flex items-center gap-1">
          <button
            onClick={() => setMode("hijri")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              mode === "hijri" ? "bg-black text-white" : "text-gray-500"
            }`}
          >
            Hijriah
          </button>
          <button
            onClick={() => setMode("gregory")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              mode === "gregory" ? "bg-black text-white" : "text-gray-500"
            }`}
          >
            Masehi
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs uppercase tracking-wide text-gray-500">
        {monthLabel}
      </p>

      <div className="mt-3 grid grid-cols-7 gap-2 text-center">
        {Array.from({ length: count }).map((_, i) => {
          const date = start.add(i, "day");
          const dateStr = date.format("YYYY-MM-DD");
          const isToday = dateStr === todayStr;
          const kebaikan = hasKebaikan(dateStr);
          const perfect = isPerfectDay(dateStr);
          const label =
            mode === "hijri"
              ? date.calendar("hijri").format("D")
              : date.format("D");
          const tone = isToday
            ? "bg-emerald-500 text-white"
            : perfect
              ? "bg-sky-300 text-black"
              : kebaikan
                ? "bg-amber-300 text-black"
                : "bg-white text-gray-700";

          return (
            <div
              key={dateStr}
              className={`h-8 w-8 border-2 border-black rounded-full grid place-items-center text-xs font-semibold ${tone}`}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full border-2 border-black bg-emerald-500" />
          Hari ini
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full border-2 border-black bg-sky-300" />
          Sempurna
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-full border-2 border-black bg-amber-300" />
          Ada kebaikan
        </span>
      </div>
    </div>
  );
}
