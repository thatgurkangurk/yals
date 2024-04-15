"use server";
import { ZodError } from "zod";
import { generateId } from "lucia";
import { db } from "../db";
import { userTable } from "../schema";
import { getUser, lucia } from "./config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import argon2 from "argon2";
import { eq, sql } from "drizzle-orm";
import { registerFormSchema, loginFormSchema } from "./validation";
import { userExists, isUsersEmpty } from "./user";

type ActionResult = { error: string };
export type ActionState =
  | {
      status: "ok";
    }
  | {
      status: "error";
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

export async function register(
  prevState: ActionState | null,
  data: FormData
): Promise<ActionState> {
  try {
    const { username, password } = registerFormSchema.parse(data);

    const hashedPassword = await argon2.hash(password);
    const userId = generateId(15);

    if (await userExists(username)) {
      return {
        status: "error",
        message: "user with that username already exists",
        errors: [
          {
            path: "username",
            message: "user with that username already exists",
          },
        ],
      };
    }

    const isEmpty = await isUsersEmpty();

    await db.insert(userTable).values({
      id: userId,
      username: username,
      hashed_password: hashedPassword,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      status: "ok",
    };
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        status: "error",
        message: "invalid form data",
        errors: e.issues.map((issue) => ({
          path: issue.path.join("."),
          message: `server validation: ${issue.message}`,
        })),
      };
    }

    return {
      status: "error",
      message: "something went wrong. please try again",
    };
  }
}

export async function login(
  prevState: ActionState | null,
  data: FormData
): Promise<ActionState> {
  try {
    const { username, password } = loginFormSchema.parse(data);

    if (!await userExists(username)) {
      const hashedPassword = argon2.hash(password); // hash the password to pretend that an account with that username exists (for security against brute-force attacks)
      return {
        status: "error",
        message: "incorrect username or password",
        errors: [
          {
            path: "username",
            message: "incorrect username or password",
          },
          {
            path: "password",
            message: "incorrect username or password",
          },
        ],
      };
    }

    const isPasswordValid = await argon2.verify(
      existingUser.hashed_password,
      password
    );

    if (!isPasswordValid) {
      return {
        status: "error",
        message: "incorrect username or password",
        errors: [
          {
            path: "username",
            message: "incorrect username or password",
          },
          {
            path: "password",
            message: "incorrect username or password",
          },
        ],
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      status: "ok",
    };
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        status: "error",
        message: "invalid form data",
        errors: e.issues.map((issue) => ({
          path: issue.path.join("."),
          message: `server validation: ${issue.message}`,
        })),
      };
    }

    return {
      status: "error",
      message: "something went wrong. please try again",
    };
  }
}

export async function signout(): Promise<ActionResult> {
  const { session } = await getUser();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/auth");
}
