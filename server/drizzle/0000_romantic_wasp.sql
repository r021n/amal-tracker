CREATE TABLE `custom_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_day_id` integer NOT NULL,
	`name` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`task_day_id`) REFERENCES `task_days`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `task_days` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`date` text NOT NULL,
	`sholat_subuh` text DEFAULT 'none' NOT NULL,
	`sholat_dzuhur` text DEFAULT 'none' NOT NULL,
	`sholat_ashar` text DEFAULT 'none' NOT NULL,
	`sholat_maghrib` text DEFAULT 'none' NOT NULL,
	`sholat_isya` text DEFAULT 'none' NOT NULL,
	`dzikir_pagi` integer DEFAULT false NOT NULL,
	`dzikir_petang` integer DEFAULT false NOT NULL,
	`quran_pages` integer DEFAULT 0 NOT NULL,
	`quran_done` integer DEFAULT false NOT NULL,
	`sedekah_amount` integer DEFAULT 0 NOT NULL,
	`sedekah_done` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `task_days_user_date_idx` ON `task_days` (`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`gender` text DEFAULT '' NOT NULL,
	`target_sedekah` integer DEFAULT 50000 NOT NULL,
	`target_quran` integer DEFAULT 2 NOT NULL,
	`streak` integer DEFAULT 0 NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`last_streak_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);