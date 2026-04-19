ALTER TABLE `characters` ADD `union_json` text;--> statement-breakpoint
ALTER TABLE `characters` DROP COLUMN `union_artifact_level`;--> statement-breakpoint
ALTER TABLE `characters` DROP COLUMN `union_artifact_exp`;--> statement-breakpoint
ALTER TABLE `characters` DROP COLUMN `union_artifact_point`;