CREATE TABLE IF NOT EXISTS `link_click` (`id` text PRIMARY KEY NOT NULL,
																																										`link_id` text NOT NULL,
																																										`timestamp` integer DEFAULT (unixepoch()) NOT NULL);

--> statement-breakpoint

CREATE TABLE IF NOT EXISTS `link` (`id` text PRIMARY KEY NOT NULL,
																																				`user_id` text NOT NULL,
																																				`slug` text NOT NULL,
																																				`target` text NOT NULL);

--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS `link_slug_unique` ON `link` (`slug`);