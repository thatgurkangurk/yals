import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { loginFormSchema } from "$lib/user";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { hashPassword, verifyPassword } from "$lib/server/password";
import { userExists } from "$lib/server/user";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, "/");
  }
  return {
    form: await superValidate(zod(loginFormSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(loginFormSchema));
    // const formData = await event.request.formData();

    if (!form.valid) {
      return fail(400, { form: form });
    }

    const { username, password } = form.data;

    const existingUser = await userExists(username);

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
      await hashPassword(password);
      return fail(400, {
        message: "Incorrect username or password",
        form,
      });
    }

    const validPassword = await verifyPassword(existingUser.hashed_password, password);
    if (!validPassword) {
      return fail(400, {
        message: "Incorrect username or password",
        form,
      });
    }

    const session = await lucia.createSession(existingUser.id, {});
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
