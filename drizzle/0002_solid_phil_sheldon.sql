CREATE TABLE IF NOT EXISTS `server_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`registration_enabled` integer DEFAULT true NOT NULL,
	`footer_enabled` integer DEFAULT true NOT NULL
);
