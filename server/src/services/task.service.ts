import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  users,
  taskDays,
  customTasks,
  SHOLAT_COLUMN_MAP,
  type TaskDay,
  type CustomTask,
  type SholatKey,
  type SholatStatus,
} from "../db/schema.js";
import { calculateDayScore } from "../utils/score.js";
import { calculateStreak, getTodayStr } from "../utils/streak.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a TaskDay + CustomTasks into the frontend-expected shape */
function formatTaskDay(day: TaskDay, customs: CustomTask[]) {
  return {
    id: day.id,
    date: day.date,
    sholat: {
      s: day.sholatSubuh,
      d: day.sholatDzuhur,
      a: day.sholatAshar,
      m: day.sholatMaghrib,
      i: day.sholatIsya,
    },
    dzikirPagi: day.dzikirPagi,
    dzikirPetang: day.dzikirPetang,
    quran: { pages: day.quranPages, done: day.quranDone },
    sedekah: { amount: day.sedekahAmount, done: day.sedekahDone },
    custom: customs.map((c) => ({ id: c.id, name: c.name, done: c.done })),
  };
}

/** Get custom tasks for a given task day */
function getCustomTasks(taskDayId: number): CustomTask[] {
  return db
    .select()
    .from(customTasks)
    .where(eq(customTasks.taskDayId, taskDayId))
    .all();
}

/** Recalculate and persist user's total score + streak */
function recalculateUserScore(userId: number, scoreDelta: number) {
  if (scoreDelta === 0) return;

  const user = db.select().from(users).where(eq(users.id, userId)).get()!;

  const updates: Record<string, unknown> = {
    score: Math.max(0, user.score + scoreDelta),
    updatedAt: new Date().toISOString(),
  };

  // Try increment streak if score increased (positive action)
  if (scoreDelta > 0) {
    const { streak, lastStreakDate } = calculateStreak(
      user.streak,
      user.lastStreakDate,
    );
    updates.streak = streak;
    updates.lastStreakDate = lastStreakDate;
  }

  db.update(users).set(updates).where(eq(users.id, userId)).run();
}

// ─── Get / Create Today ──────────────────────────────────────────────────────

export function getOrCreateToday(userId: number) {
  const today = getTodayStr();

  let day = db
    .select()
    .from(taskDays)
    .where(and(eq(taskDays.userId, userId), eq(taskDays.date, today)))
    .get();

  if (!day) {
    day = db
      .insert(taskDays)
      .values({ userId, date: today })
      .returning()
      .get();
  }

  const customs = getCustomTasks(day.id);
  return { taskDay: formatTaskDay(day, customs) };
}

// ─── Sholat ──────────────────────────────────────────────────────────────────

export function updateSholat(
  userId: number,
  key: SholatKey,
  status: SholatStatus,
) {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  const customs = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customs);

  const columnName = SHOLAT_COLUMN_MAP[key];
  db.update(taskDays)
    .set({ [columnName]: status, updatedAt: new Date().toISOString() })
    .where(eq(taskDays.id, dayRecord.id))
    .run();

  const updatedDay = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, dayRecord.id))
    .get()!;
  const scoreAfter = calculateDayScore(updatedDay, customs);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(updatedDay, customs),
    scoreDelta,
  };
}

export function updateAllSholat(userId: number, status: SholatStatus) {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  const customs = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customs);

  db.update(taskDays)
    .set({
      sholatSubuh: status,
      sholatDzuhur: status,
      sholatAshar: status,
      sholatMaghrib: status,
      sholatIsya: status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(taskDays.id, dayRecord.id))
    .run();

  const updatedDay = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, dayRecord.id))
    .get()!;
  const scoreAfter = calculateDayScore(updatedDay, customs);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(updatedDay, customs),
    scoreDelta,
  };
}

// ─── Dzikir ──────────────────────────────────────────────────────────────────

export function toggleDzikir(userId: number, type: "pagi" | "petang") {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  const customs = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customs);

  const field = type === "pagi" ? "dzikirPagi" : "dzikirPetang";
  const newValue = !dayRecord[field];

  db.update(taskDays)
    .set({ [field]: newValue, updatedAt: new Date().toISOString() })
    .where(eq(taskDays.id, dayRecord.id))
    .run();

  const updatedDay = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, dayRecord.id))
    .get()!;
  const scoreAfter = calculateDayScore(updatedDay, customs);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(updatedDay, customs),
    scoreDelta,
  };
}

export function setAllDzikir(userId: number, done: boolean) {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  const customs = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customs);

  db.update(taskDays)
    .set({
      dzikirPagi: done,
      dzikirPetang: done,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(taskDays.id, dayRecord.id))
    .run();

  const updatedDay = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, dayRecord.id))
    .get()!;
  const scoreAfter = calculateDayScore(updatedDay, customs);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(updatedDay, customs),
    scoreDelta,
  };
}

// ─── Quran ───────────────────────────────────────────────────────────────────

export function setQuranPages(userId: number, pages: number) {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  const customs = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customs);

  db.update(taskDays)
    .set({ quranPages: pages, updatedAt: new Date().toISOString() })
    .where(eq(taskDays.id, dayRecord.id))
    .run();

  const updatedDay = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, dayRecord.id))
    .get()!;
  const scoreAfter = calculateDayScore(updatedDay, customs);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(updatedDay, customs),
    scoreDelta,
  };
}

export function toggleQuran(userId: number) {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  // Can't toggle if no pages
  if (dayRecord.quranPages <= 0) {
    const customs = getCustomTasks(dayRecord.id);
    return { taskDay: formatTaskDay(dayRecord, customs), scoreDelta: 0 };
  }

  const customs = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customs);

  db.update(taskDays)
    .set({ quranDone: !dayRecord.quranDone, updatedAt: new Date().toISOString() })
    .where(eq(taskDays.id, dayRecord.id))
    .run();

  const updatedDay = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, dayRecord.id))
    .get()!;
  const scoreAfter = calculateDayScore(updatedDay, customs);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(updatedDay, customs),
    scoreDelta,
  };
}

// ─── Sedekah ─────────────────────────────────────────────────────────────────

export function setSedekahAmount(userId: number, amount: number) {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  const customs = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customs);

  db.update(taskDays)
    .set({ sedekahAmount: amount, updatedAt: new Date().toISOString() })
    .where(eq(taskDays.id, dayRecord.id))
    .run();

  const updatedDay = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, dayRecord.id))
    .get()!;
  const scoreAfter = calculateDayScore(updatedDay, customs);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(updatedDay, customs),
    scoreDelta,
  };
}

export function toggleSedekah(userId: number) {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  if (dayRecord.sedekahAmount <= 0) {
    const customs = getCustomTasks(dayRecord.id);
    return { taskDay: formatTaskDay(dayRecord, customs), scoreDelta: 0 };
  }

  const customs = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customs);

  db.update(taskDays)
    .set({ sedekahDone: !dayRecord.sedekahDone, updatedAt: new Date().toISOString() })
    .where(eq(taskDays.id, dayRecord.id))
    .run();

  const updatedDay = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, dayRecord.id))
    .get()!;
  const scoreAfter = calculateDayScore(updatedDay, customs);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(updatedDay, customs),
    scoreDelta,
  };
}

// ─── Custom Tasks ────────────────────────────────────────────────────────────

export function addCustomTask(userId: number, name: string) {
  const { taskDay } = getOrCreateToday(userId);
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, taskDay.id))
    .get()!;

  db.insert(customTasks)
    .values({ taskDayId: dayRecord.id, name, done: false })
    .run();

  const customs = getCustomTasks(dayRecord.id);
  return { taskDay: formatTaskDay(dayRecord, customs) };
}

export function toggleCustomTask(userId: number, customTaskId: number) {
  const task = db
    .select()
    .from(customTasks)
    .where(eq(customTasks.id, customTaskId))
    .get();

  if (!task) {
    throw { status: 404, code: "NOT_FOUND", message: "Custom task tidak ditemukan." };
  }

  // Verify ownership
  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, task.taskDayId))
    .get()!;

  if (dayRecord.userId !== userId) {
    throw { status: 403, code: "FORBIDDEN", message: "Tidak punya akses ke task ini." };
  }

  const customsBefore = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customsBefore);

  db.update(customTasks)
    .set({ done: !task.done })
    .where(eq(customTasks.id, customTaskId))
    .run();

  const customsAfter = getCustomTasks(dayRecord.id);
  const scoreAfter = calculateDayScore(dayRecord, customsAfter);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(dayRecord, customsAfter),
    scoreDelta,
  };
}

export function removeCustomTask(userId: number, customTaskId: number) {
  const task = db
    .select()
    .from(customTasks)
    .where(eq(customTasks.id, customTaskId))
    .get();

  if (!task) {
    throw { status: 404, code: "NOT_FOUND", message: "Custom task tidak ditemukan." };
  }

  const dayRecord = db
    .select()
    .from(taskDays)
    .where(eq(taskDays.id, task.taskDayId))
    .get()!;

  if (dayRecord.userId !== userId) {
    throw { status: 403, code: "FORBIDDEN", message: "Tidak punya akses ke task ini." };
  }

  const customsBefore = getCustomTasks(dayRecord.id);
  const scoreBefore = calculateDayScore(dayRecord, customsBefore);

  db.delete(customTasks).where(eq(customTasks.id, customTaskId)).run();

  const customsAfter = getCustomTasks(dayRecord.id);
  const scoreAfter = calculateDayScore(dayRecord, customsAfter);
  const scoreDelta = scoreAfter - scoreBefore;

  recalculateUserScore(userId, scoreDelta);

  return {
    taskDay: formatTaskDay(dayRecord, customsAfter),
    scoreDelta,
  };
}

// ─── History ─────────────────────────────────────────────────────────────────

export function getHistory(userId: number, from?: string, to?: string) {
  // Build conditions array
  const conditions = [eq(taskDays.userId, userId)];
  if (from) conditions.push(gte(taskDays.date, from));
  if (to) conditions.push(lte(taskDays.date, to));

  const query = db
    .select()
    .from(taskDays)
    .where(and(...conditions));

  const dayRecords = query.all();

  const days = dayRecords.map((day) => {
    const customs = getCustomTasks(day.id);
    return formatTaskDay(day, customs);
  });

  // Sort descending by date
  days.sort((a, b) => b.date.localeCompare(a.date));

  return { days };
}

// ─── Weekly Sedekah ──────────────────────────────────────────────────────────

export function getWeeklySedekah(userId: number) {
  // Find the most recent Friday (start of Islamic week cycle as used in frontend)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 5=Fri
  const daysFromFriday = (dayOfWeek + 2) % 7; // how many days since last Friday
  const friday = new Date(now);
  friday.setDate(friday.getDate() - daysFromFriday);
  friday.setHours(0, 0, 0, 0);

  const fridayStr = `${friday.getFullYear()}-${String(friday.getMonth() + 1).padStart(2, "0")}-${String(friday.getDate()).padStart(2, "0")}`;

  const dayRecords = db
    .select()
    .from(taskDays)
    .where(
      and(
        eq(taskDays.userId, userId),
        gte(taskDays.date, fridayStr),
        eq(taskDays.sedekahDone, true),
      ),
    )
    .all();

  const total = dayRecords.reduce((sum, d) => sum + d.sedekahAmount, 0);
  return { total };
}
