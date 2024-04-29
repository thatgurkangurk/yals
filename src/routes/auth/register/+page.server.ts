import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { generateId } from "lucia";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/db";
import { users } from "$lib/db/schema/user";
import { registerFormSchema } from "$lib/user";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, "/");
  }
  return {
    form: await superValidate(zod(registerFormSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(registerFormSchema));

    if (!form.valid) {
      return fail(400, { form: form });
    }

    const { username, password } = form.data;

    const userId = generateId(15);
    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "argon2id",
    });

    const userExists = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, username),
    });

    if (userExists) {
      setError(form, "username", "username is not unique");
      return fail(400, { form: form });
    }

    try {
      await db.insert(users).values({
        id: userId,
        username: username,
        hashed_password: hashedPassword,
      });
    } catch (e) {
      console.error(e);
    }
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    return {
      form,
    };
  },
};
