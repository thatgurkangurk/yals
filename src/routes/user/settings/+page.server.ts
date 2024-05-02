import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { updatePasswordSchema } from "./schemas";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) return redirect(302, "/");
    return {
        user: event.locals.user,
        forms: {
            updatePassword: await superValidate(zod(updatePasswordSchema))
        }
    }
}