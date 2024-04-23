import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db } from "$lib/db";
import { loginFormSchema } from "$lib/server/user";

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const user = {
			username: String(formData.get("username")),
			password: String(formData.get("password"))
		}

		const safeParse = loginFormSchema.safeParse(user);

		if (!(safeParse.success)) {
			return fail(400, { issues: safeParse.error.issues });
		}

		const { username, password } = safeParse.data;

		const existingUser = await db.query.users.findFirst({
			where: (user, { eq }) => eq(user.username, username),
		  });
		if (!existingUser) {
			// NOTE:
			// Returning immediately allows malicious actors to figure out valid usernames from response times,
			// allowing them to only focus on guessing passwords in brute-force attacks.
			// As a preventive measure, you may want to hash passwords even for invalid usernames.
			// However, valid usernames can be already be revealed with the signup page among other methods.
			// It will also be much more resource intensive.
			// Since protecting against this is non-trivial,
			// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
			// If usernames are public, you may outright tell the user that the username is invalid.
			Bun.password.hash(password);
			return fail(400, {
				message: "Incorrect username or password"
			});
		}

		const validPassword = await Bun.password.verify(password, existingUser.hashed_password, "argon2id");
		if (!validPassword) {
			return fail(400, {
				message: "Incorrect username or password"
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/");
	}
};