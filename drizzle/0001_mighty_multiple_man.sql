/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/ 
CREATE TABLE `new_user` (`id` TEXT PRIMARY KEY NOT NULL, 
                                               `username` TEXT NOT NULL, 
                                                               `hashed_password` TEXT NOT NULL, 
                                                                                      `role` TEXT NOT NULL DEFAULT 'user');


INSERT INTO `new_user` (`id`, `username`, `hashed_password`, `role`, `sessions`)
SELECT `id`,
       `username`,
       `hashed_password`,
       `role`,
       `sessions`
FROM `user`;


DROP TABLE `user`;


ALTER TABLE `new_user` RENAME TO `user`;


CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);


CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);