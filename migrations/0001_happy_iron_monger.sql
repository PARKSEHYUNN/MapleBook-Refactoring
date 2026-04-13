CREATE TABLE `consent_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`terms_version` text NOT NULL,
	`privacy_version` text NOT NULL,
	`markting_agreed` integer DEFAULT false NOT NULL,
	`consented_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`ip_address` text,
	`user_agnet` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `consent_logs_user_id_idx` ON `consent_logs` (`user_id`);