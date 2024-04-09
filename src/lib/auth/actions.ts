"use server";
import { z } from "zod";
import { generateId } from "lucia";
import { db } from "../db";
import { userTable } from "../schema";
import { getUser, lucia } from "./config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import argon2 from "argon2";
import { eq } from "drizzle-orm";

const usernameSchema = z
  .string()
  .min(5, { message: "username has to be 5 characters long" })
  .max(24, { message: "username has to be shorter than 24 characters" })
  .regex(/^[a-z0-9_-]+$/, {
    message: "username cannot use special characters",
  });

const passwordSchema = z.string().min(10).max(128);

type ActionResult = { error: string };

export async function register(formData: FormData): Promise<ActionResult> {
  const username = formData.get("username");

  const usernameValidityTest = usernameSchema.safeParse(username);

  if (typeof username !== "string" || !usernameValidityTest.success) {
    return {
      error: "invalid username",
    };
  }

  const password = formData.get("password");
  const passwordValidityTest = passwordSchema.safeParse(password);

  if (typeof password !== "string" || !passwordValidityTest.success) {
    return {
      error: "invalid password",
    };
  }

  const hashedPassword = await argon2.hash(password);
  const userId = generateId(15);

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

  redirect("/dashboard");
}

export async function login(formData: FormData): Promise<ActionResult> {
  const username = formData.get("username");

  const usernameValidityTest = usernameSchema.safeParse(username);

  if (typeof username !== "string" || !usernameValidityTest.success) {
    return {
      error: "invalid username",
    };
  }

  const password = formData.get("password");
  const passwordValidityTest = passwordSchema.safeParse(password);

  if (typeof password !== "string" || !passwordValidityTest.success) {
    return {
      error: "invalid password",
    };
  }

  const existingUser = (
    await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
      .limit(1)
  )[0];

  if (!existingUser) {
    const hashedPassword = argon2.hash(password); // hash the password to pretend that an account with that username exists (for security against brute-force attacks)
    return {
      error: "incorrect username or password",
    };
  }

  const isPasswordValid = await argon2.verify(
    existingUser.hashed_password,
    password
  );

  if (!isPasswordValid) {
    return {
      error: "incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  redirect("/dashboard");
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
