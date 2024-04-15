"use server";
import { ZodError } from "zod";
import { getUser as getSession, lucia } from "./config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { registerFormSchema, loginFormSchema } from "./validation";
import { userExists, getUser, createUser, createSession } from "./user";
import { hashPassword, verifyPassword } from "./password";

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

    const user = await createUser(username, password);
    const sessionCookie = await createSession(user.id);

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

    if (!(await userExists(username))) {
      const hashedPassword = hashPassword(password); // hash the password to pretend that an account with that username exists (for security against brute-force attacks)
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

    const existingUser = await getUser(username);

    const isPasswordValid = await verifyPassword(
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

    const sessionCookie = await createSession(existingUser.id);
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
  const { session } = await getSession();
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
