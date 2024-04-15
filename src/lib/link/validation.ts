import { z } from "zod";
import { zfd } from "zod-form-data";

export const linkFormSchema = zfd.formData({
  target: z.string().url({
    message: "target needs to be a valid URL",
  }),
  slug: z
    .string()
    .min(2, {
      message: "slug has to be longer than 2 characters",
    })
    .max(128, {
      message: "slug has to be shorter than 128 characters",
    })
    .regex(/^[a-zA-Z1-9_-]+$/, {
      message: "slug cannot have any special characters",
    }),
});

export const deleteLinkFormSchema = zfd.formData({
  id: z.string().min(2),
});
