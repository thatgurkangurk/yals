import { z } from "zod";

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


export const loginFormSchema = z.object({
    username: usernameSchema,
    password: passwordSchema
});

export const registerFormSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "passwords do not match",
  });