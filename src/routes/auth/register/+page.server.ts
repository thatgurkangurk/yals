import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import type { Actions } from "./$types";
import { db } from "$lib/db";
import { users } from "$lib/db/schema/user";

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get("username");
		const password = formData.get("password");
		// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (
			typeof username !== "string" ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return fail(400, {
				message: "Invalid username"
			});
		}
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: "Invalid password"
			});
		}

		const userId = generateId(15);
		const hashedPassword = await Bun.password.hash(password, {
            algorithm: "argon2id"
        });

		// TODO: check if username is already used
		await db.insert(users).values({
			id: userId,
			username: username,
			hashed_password: hashedPassword
		});

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/");
	}
};