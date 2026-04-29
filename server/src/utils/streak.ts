/**
 * Try to increment a user's streak.
 * Returns updated streak and lastStreakDate values.
 *
 * Logic mirrors the frontend useUserStore.tryIncrementStreak():
 * - If lastStreakDate === today → no change
 * - If lastStreakDate === yesterday → streak + 1
 * - Otherwise → reset to 1
 */
export function calculateStreak(
  currentStreak: number,
  lastStreakDate: string | null,
): { streak: number; lastStreakDate: string } {
  const today = new Date();
  const todayStr = formatDate(today);

  // Already incremented today
  if (lastStreakDate === todayStr) {
    return { streak: currentStreak, lastStreakDate: todayStr };
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  const newStreak = lastStreakDate === yesterdayStr ? currentStreak + 1 : 1;

  return { streak: newStreak, lastStreakDate: todayStr };
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getTodayStr(): string {
  return formatDate(new Date());
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
