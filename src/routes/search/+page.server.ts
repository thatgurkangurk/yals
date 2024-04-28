import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { message, superValidate, type Infer } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { searchFormSchema, type SearchFormSchema } from "./validation";
import { extractSlug, getLinkBySlug } from "$lib/links";

export const load: PageServerLoad = async (event) => {
  return {
    form: await superValidate<Infer<SearchFormSchema>, Response>(
      zod(searchFormSchema)
    ),
  };
};

type Response =
  | {
      status: "FAIL";
      message: string;
    }
  | {
      status: "OK";
      target: string;
      slug: string;
    };

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate<Infer<SearchFormSchema>, Response>(
      event,
      zod(searchFormSchema)
    );

    if (!form.valid) {
      return fail(400, { form: form });
    }

    const { slug } = form.data;

    const extractedSlug = extractSlug(slug);

    const link = await getLinkBySlug(extractedSlug);

    if (!link) {
      return message(
        form,
        {
          status: "FAIL",
          message: "link was not found",
        },
        {
          status: 404,
        }
      );
    }

    return message(form, {
      status: "OK",
      target: link.target,
      slug: extractedSlug,
    });
  },
};
