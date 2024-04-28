import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { fail, superValidate } from "sveltekit-superforms";
import { createLinkFormSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { createLink } from "$lib/links";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) return redirect(302, "/");
  return {
    form: await superValidate(zod(createLinkFormSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.user) return redirect(302, "/");
    const form = await superValidate(event, zod(createLinkFormSchema));

    if (!form.valid) {
      return fail(400, { form: form });
    }

    const { slug, target } = form.data;

    const link = await createLink(slug, target, event.locals.user);

    return redirect(302, `/dashboard/links/${link.id}`);
  },
};
