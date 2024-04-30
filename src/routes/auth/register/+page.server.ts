import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { registerFormSchema } from "$lib/user";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { getServerSettingsOrInit } from "$lib/serverSettings";
import { createUser } from "$lib/server/user";
import { createSessionCookie } from "$lib/server/session";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, "/");
  }

  const settings = await getServerSettingsOrInit();

  return {
    form: await superValidate(zod(registerFormSchema)),
    settings: settings,
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(registerFormSchema));
    const settings = await getServerSettingsOrInit();

    if (!settings.registrationEnabled) {
      setError(form, "registration is disabled");
      return fail(400, { form: form });
    }

    if (!form.valid) {
      return fail(400, { form: form });
    }

    const { username, password } = form.data;

    const result = await createUser({
      username,
      password
    });

    if (!result.success) {
      switch (result.cause) {
        case "USER_EXISTS": {
          setError(form, "username", "a user with that username already exists");
          return fail(409, { form: form });
        }
        case "UNEXPECTED_ERROR": {
          setError(form, "something unexpected went wrong, please try again later");
          return fail(500, { form: form });
        }
      }
    }

    const { user } = result;
    
    const sessionCookie = await createSessionCookie(user);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });

    return {
      form,
    };
  },
};
