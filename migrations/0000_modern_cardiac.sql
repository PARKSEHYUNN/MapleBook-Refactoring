CREATE TABLE `character_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_id` integer NOT NULL,
	`ocid` text NOT NULL,
	`snapshot_data` text NOT NULL,
	`snapshot_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ocid` text NOT NULL,
	`user_id` integer,
	`character_name` text NOT NULL,
	`world_name` text NOT NULL,
	`character_class` text NOT NULL,
	`character_class_level` real,
	`character_level` integer NOT NULL,
	`character_exp` integer DEFAULT 0 NOT NULL,
	`character_exp_rate` real DEFAULT 0 NOT NULL,
	`character_date_create` text,
	`character_guild_name` text,
	`character_guild_id` integer,
	`character_image` text,
	`accessFlag` integer DEFAULT false NOT NULL,
	`popularity` integer DEFAULT 0,
	`combat_power` integer DEFAULT 0,
	`unionLevel` integer DEFAULT 0,
	`unionGrade` text DEFAULT '없음',
	`stat_json` text,
	`hyper_stat_json` text,
	`propensity_json` text,
	`ability_json` text,
	`equipment_json` text,
	`symbol_json` text,
	`cash_equipment_json` text,
	`set_effect_json` text,
	`beauty_equipment_json` text,
	`android_json` text,
	`pet_json` text,
	`skill_json` text,
	`link_skill_json` text,
	`vmatrix_json` text,
	`hexamatrix_json` text,
	`hexa_stat_json` text,
	`dojang_json` text,
	`other_json` text,
	`ring_reserve_skill_json` text,
	`default_settings` text,
	`bio` text,
	`synced_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`is_incomplete` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`character_guild_id`) REFERENCES `guilds`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `characters_ocid_unique` ON `characters` (`ocid`);--> statement-breakpoint
CREATE TABLE `guilds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`oguild_id` text NOT NULL,
	`world_name` text NOT NULL,
	`guild_name` text NOT NULL,
	`guild_level` integer DEFAULT 0 NOT NULL,
	`guild_fame` integer DEFAULT 0 NOT NULL,
	`guild_master_id` integer NOT NULL,
	`guild_member_count` integer NOT NULL,
	`guild_skill_json` text,
	`noblesse_skill_json` text,
	`synced_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`guild_master_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`type` text DEFAULT 'review' NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`link` text,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `unread_idx` ON `notifications` (`user_id`,`is_read`);--> statement-breakpoint
CREATE TABLE `review_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporter_id` integer NOT NULL,
	`review_id` integer NOT NULL,
	`reason` text NOT NULL,
	`comment` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`resolved_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_report` ON `review_reports` (`reporter_id`,`review_id`);--> statement-breakpoint
CREATE TABLE `review_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`review_id` integer NOT NULL,
	`voter_id` integer NOT NULL,
	`vote` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`voter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "vote_check" CHECK("review_votes"."vote" IN (-1, 1))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_vote` ON `review_votes` (`review_id`,`voter_id`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reviewer_id` integer NOT NULL,
	`target_id` integer NOT NULL,
	`manner_score` integer NOT NULL,
	`content` text,
	`images` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "manner_score_check" CHECK("reviews"."manner_score" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ouid` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`is_banned` integer DEFAULT false NOT NULL,
	`ban_reason` text,
	`main_character_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`main_character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_ouid_unique` ON `users` (`ouid`);--> statement-breakpoint
CREATE TABLE `view_counts` (
	`character_id` integer NOT NULL,
	`period_type` text NOT NULL,
	`period_key` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`character_id`, `period_type`, `period_key`),
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `visitor_logs` (
	`character_id` integer NOT NULL,
	`day` text NOT NULL,
	`identifier` text NOT NULL,
	PRIMARY KEY(`character_id`, `day`, `identifier`),
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE no action
);
