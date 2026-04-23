import { useState } from "react";
import dayjs from "../lib/dayjs";
import { useTaskStore } from "../store/useTaskStore";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "motion/react";

export default function Calendar() {
  const [mode, setMode] = useState<"hijri" | "gregory">("hijri");
  const days = useTaskStore(useShallow((s) => s.days));
  const weekdayLabels = ["S", "S", "R", "K", "J", "S", "M"];
  const today = dayjs();
  const todayStr = today.format("YYYY-MM-DD");
  const gregoryMonthStart = today.startOf("month");
  const gregoryMonthCount = today.daysInMonth();
  const gregoryMonthKey = gregoryMonthStart.format("YYYY-MM");

  const hijriMonthKey = today.calendar("hijri").format("YYYY-MM");
  const findHijriBoundary = (direction: 1 | -1) => {
    let cursor = today;
    while (
      cursor.add(direction, "day").calendar("hijri").format("YYYY-MM") ===
      hijriMonthKey
    ) {
      cursor = cursor.add(direction, "day");
    }
    return cursor;
  };
  const hijriMonthStart = findHijriBoundary(-1);
  const hijriMonthEnd = findHijriBoundary(1);
  const hijriMonthCount = hijriMonthEnd.diff(hijriMonthStart, "day") + 1;

  const activeMonthStart =
    mode === "hijri" ? hijriMonthStart : gregoryMonthStart;
  const activeMonthCount =
    mode === "hijri" ? hijriMonthCount : gregoryMonthCount;

  // Monday-first offset so weekday headers align with date cells.
  const startOffset = (activeMonthStart.day() + 6) % 7;
  const gridStart = activeMonthStart.subtract(startOffset, "day");
  const calendarDates = Array.from({ length: 42 }, (_, i) =>
    gridStart.add(i, "day"),
  );

  const hasKebaikan = (dateStr: string) => {
    const d = days[dateStr];
    if (!d) return false;
    return (
      Object.values(d.sholat).some((v) => v === "done") ||
      d.dzikirPagi ||
      d.dzikirPetang ||
      (d.quran.pages > 0 && d.quran.done) ||
      (d.sedekah.amount > 0 && d.sedekah.done) ||
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
      d.quran.pages > 0 &&
      d.quran.done &&
      d.sedekah.amount > 0 &&
      d.sedekah.done
    );
  };

  const perfectDays = Array.from({ length: activeMonthCount }).filter(
    (_, i) => {
      const dateStr = activeMonthStart.add(i, "day").format("YYYY-MM-DD");
      return isPerfectDay(dateStr);
    },
  ).length;

  const monthLabel =
    mode === "hijri"
      ? activeMonthStart.calendar("hijri").format("MMMM YYYY [H]")
      : activeMonthStart.format("MMMM YYYY");

  const activeMonthTotal = activeMonthCount;

  return (
    <div className="rounded-[26px] border-2 border-black bg-stone-50 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold leading-none">Calendar</h2>
          <p className="mt-1 text-sm text-gray-500">Ibadah streak</p>
          <p className="mt-5 text-sm text-gray-500">Hari sempurna</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-black"
            >
              {perfectDays}{" "}
              <span className="text-xl font-semibold text-gray-600">
                / {activeMonthTotal}
              </span>
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="rounded-full border-2 border-black p-1 bg-white flex items-center gap-1">
          <button
            onClick={() => setMode("hijri")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              mode === "hijri" ? "bg-black text-white" : "text-gray-500 hover:bg-stone-50"
            }`}
          >
            Hijriah
          </button>
          <button
            onClick={() => setMode("gregory")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
              mode === "gregory" ? "bg-black text-white" : "text-gray-500 hover:bg-stone-50"
            }`}
          >
            Masehi
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mt-3 text-xs uppercase tracking-wide text-gray-500">
            {monthLabel}
          </p>

          <div className="mt-3 grid grid-cols-7 gap-2 text-center">
            {weekdayLabels.map((label, idx) => (
              <div
                key={`${label}-${idx}`}
                className="text-[11px] font-bold uppercase tracking-wide text-gray-500"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2 text-center">
            {calendarDates.map((date) => {
              const dateStr = date.format("YYYY-MM-DD");
              const isToday = dateStr === todayStr;
              const isCurrentMonth =
                mode === "hijri"
                  ? date.calendar("hijri").format("YYYY-MM") === hijriMonthKey
                  : date.format("YYYY-MM") === gregoryMonthKey;
              const kebaikan = hasKebaikan(dateStr);
              const perfect = isPerfectDay(dateStr);
              const label =
                mode === "hijri"
                  ? date.calendar("hijri").format("D")
                  : date.format("D");
              const tone = !isCurrentMonth
                ? "bg-stone-100 text-gray-400 border-black/40"
                : isToday
                  ? "bg-emerald-500 text-white"
                  : perfect
                    ? "bg-sky-300 text-black"
                    : kebaikan
                      ? "bg-amber-300 text-black"
                      : "bg-white text-gray-700";

              return (
                <div
                  key={dateStr}
                  className={`h-8 w-8 rounded-full border-2 grid place-items-center text-xs font-semibold transition-colors ${tone} ${!isCurrentMonth ? "opacity-70" : ""}`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

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
