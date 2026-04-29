import type { TaskDay, CustomTask } from "../db/schema.js";

const TASK_SCORE = 10;

/**
 * Calculate the score for a single task day.
 * This mirrors the frontend logic in useTaskStore exactly.
 */
export function calculateDayScore(
  day: TaskDay,
  customTasks: CustomTask[],
): number {
  // Sholat: each "done" = 10 pts
  const sholatStatuses = [
    day.sholatSubuh,
    day.sholatDzuhur,
    day.sholatAshar,
    day.sholatMaghrib,
    day.sholatIsya,
  ];
  const sholatScore =
    sholatStatuses.filter((s) => s === "done").length * TASK_SCORE;

  // Dzikir: pagi + petang, each = 10 pts
  const dzikirScore =
    (Number(day.dzikirPagi) + Number(day.dzikirPetang)) * TASK_SCORE;

  // Quran: pages * 10 pts (only if marked done)
  const quranScore = day.quranDone ? day.quranPages * TASK_SCORE : 0;

  // Sedekah: floor(amount / 1000) * 10 pts (only if marked done)
  const sedekahScore = day.sedekahDone
    ? Math.floor(day.sedekahAmount / 1000) * TASK_SCORE
    : 0;

  // Custom tasks: each done = 10 pts
  const customScore =
    customTasks.filter((c) => c.done).length * TASK_SCORE;

  return sholatScore + dzikirScore + quranScore + sedekahScore + customScore;
}

/**
 * Calculate total score across multiple task days.
 */
export function calculateTotalScore(
  days: { day: TaskDay; customs: CustomTask[] }[],
): number {
  return days.reduce(
    (total, { day, customs }) => total + calculateDayScore(day, customs),
    0,
  );
}
