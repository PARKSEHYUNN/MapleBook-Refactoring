CREATE TABLE `potential_option_grades` (
	`option_text` text PRIMARY KEY NOT NULL,
	`grade` text NOT NULL,
	`seen_count` integer DEFAULT 1 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
