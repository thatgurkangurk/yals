import { z } from "zod";
import { zfd } from "zod-form-data";

export const usernameSchema = z
  .string()
  .min(5, { message: "username has to be at least 5 characters long" })
  .max(24, { message: "username has to be shorter than 24 characters" })
  .regex(/^[a-z0-9_-]+$/, {
    message: "username cannot use special characters",
  });

export const passwordSchema = z
  .string()
  .min(10, {
    message: "password has to be at least 10 characters long",
  })
  .max(128, {
    message: "password cannot be longer than 128 characters",
  });

export const registerFormSchema = zfd
  .formData({
    username: zfd.text(usernameSchema),
    password: zfd.text(passwordSchema),
    passwordConfirm: zfd.text(passwordSchema),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "passwords do not match",
  });

export const loginFormSchema = zfd.formData({
  username: zfd.text(usernameSchema),
  password: zfd.text(passwordSchema),
});
