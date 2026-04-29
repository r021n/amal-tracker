import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default(""),
  gender: text("gender", { enum: ["", "L", "P"] })
    .notNull()
    .default(""),
  targetSedekah: integer("target_sedekah").notNull().default(50000),
  targetQuran: integer("target_quran").notNull().default(2),
  streak: integer("streak").notNull().default(0),
  score: integer("score").notNull().default(0),
  lastStreakDate: text("last_streak_date"),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

// ─── Task Days ────────────────────────────────────────────────────────────────

export const taskDays = sqliteTable(
  "task_days",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // YYYY-MM-DD

    // Sholat – 5 individual columns
    sholatSubuh: text("sholat_subuh", {
      enum: ["none", "done", "halangan"],
    })
      .notNull()
      .default("none"),
    sholatDzuhur: text("sholat_dzuhur", {
      enum: ["none", "done", "halangan"],
    })
      .notNull()
      .default("none"),
    sholatAshar: text("sholat_ashar", {
      enum: ["none", "done", "halangan"],
    })
      .notNull()
      .default("none"),
    sholatMaghrib: text("sholat_maghrib", {
      enum: ["none", "done", "halangan"],
    })
      .notNull()
      .default("none"),
    sholatIsya: text("sholat_isya", {
      enum: ["none", "done", "halangan"],
    })
      .notNull()
      .default("none"),

    // Dzikir
    dzikirPagi: integer("dzikir_pagi", { mode: "boolean" })
      .notNull()
      .default(false),
    dzikirPetang: integer("dzikir_petang", { mode: "boolean" })
      .notNull()
      .default(false),

    // Quran
    quranPages: integer("quran_pages").notNull().default(0),
    quranDone: integer("quran_done", { mode: "boolean" })
      .notNull()
      .default(false),

    // Sedekah
    sedekahAmount: integer("sedekah_amount").notNull().default(0),
    sedekahDone: integer("sedekah_done", { mode: "boolean" })
      .notNull()
      .default(false),

    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex("task_days_user_date_idx").on(table.userId, table.date),
  ],
);

// ─── Custom Tasks ─────────────────────────────────────────────────────────────

export const customTasks = sqliteTable("custom_tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskDayId: integer("task_day_id")
    .notNull()
    .references(() => taskDays.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  taskDays: many(taskDays),
}));

export const taskDaysRelations = relations(taskDays, ({ one, many }) => ({
  user: one(users, {
    fields: [taskDays.userId],
    references: [users.id],
  }),
  customTasks: many(customTasks),
}));

export const customTasksRelations = relations(customTasks, ({ one }) => ({
  taskDay: one(taskDays, {
    fields: [customTasks.taskDayId],
    references: [taskDays.id],
  }),
}));

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type TaskDay = typeof taskDays.$inferSelect;
export type NewTaskDay = typeof taskDays.$inferInsert;
export type CustomTask = typeof customTasks.$inferSelect;
export type NewCustomTask = typeof customTasks.$inferInsert;

// Sholat key mapping used by services
export type SholatKey = "s" | "d" | "a" | "m" | "i";
export type SholatStatus = "none" | "done" | "halangan";

export const SHOLAT_COLUMN_MAP = {
  s: "sholatSubuh",
  d: "sholatDzuhur",
  a: "sholatAshar",
  m: "sholatMaghrib",
  i: "sholatIsya",
} as const;
