import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import type { Actions } from "./$types";
import { db } from "$lib/db";
import { users } from "$lib/db/schema/user";
import { registerFormSchema } from "$lib/server/user";

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const user = {
            username: String(formData.get("username")),
            password: String(formData.get("password")),
            passwordConfirm: String(formData.get("password-confirm"))
        };
		
        const safeParse = registerFormSchema.safeParse(user);

        if (!safeParse.success) {
            return fail(400, { issues: safeParse.error.issues });
        }

        const { username, password } = safeParse.data;

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