CREATE TABLE IF NOT EXISTS `session`
				(`id` text PRIMARY KEY NOT NULL,
						`user_id` text NOT NULL,
						`expires_at` integer NOT NULL,
					FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `user` (`id` text PRIMARY KEY NOT NULL,
																																				`username` text NOT NULL,
																																				`hashed_password` text NOT NULL,
																																				`role` text DEFAULT 'user' NOT NULL);

--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS `session_id_unique` ON `session` (`id`);--> statement-breakpoint


CREATE UNIQUE INDEX IF NOT EXISTS `user_id_unique` ON `user` (`id`);--> statement-breakpoint


CREATE UNIQUE INDEX IF NOT EXISTS `user_username_unique` ON `user` (`username`);