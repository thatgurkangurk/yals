import { passwordSchema } from "$lib/user";
import { z } from "zod";

export const updatePasswordSchema = z.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    newPasswordConfirm: passwordSchema
}).refine((data) => data.newPassword === data.newPasswordConfirm, {
    path: ["newPassword", "newPasswordConfirm"],
    message: "passwords do not match",
});

export type UpdatePasswordSchema = typeof updatePasswordSchema;