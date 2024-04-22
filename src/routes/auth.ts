import type { AppContext } from "@/context";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  createUser,
  getUser,
  userExists,
} from "@/lib/auth/user";
import { get } from "@/lib/config";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";

const auth = new OpenAPIHono<AppContext>();

const usernameSchema = z
  .string()
  .min(5, { message: "username has to be at least 5 characters long" })
  .max(24, { message: "username has to be shorter than 24 characters" })
  .regex(/^[a-z0-9_-]+$/, {
    message: "username cannot use special characters and has to be lowercase",
  })
  .openapi("Username", {
    example: "thatgurkangurk",
  });

const passwordSchema = z
  .string()
  .min(10, {
    message: "password has to be at least 10 characters long",
  })
  .max(128, {
    message: "password cannot be longer than 128 characters",
  })
  .openapi("Password", {
    example: "Sup3r-S3cr3t-Pa$$w0rd",
  });

const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

auth.get("/", (c) => c.text("auth"));

const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    200: {
      headers: z.object({
        "Set-Cookie": z.string().openapi({
          example: "auth_session=SESSION_ID",
        }),
      }),
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              enum: ["ok"],
            }),
          }),
        },
      },
      description:
        "this response gets sent when the user successfully registerred an account",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              enum: ["error"],
            }),
            message: z.string().openapi({
              default: "already authenticated",
            }),
          }),
        },
      },
      description:
        "this response gets sent when the user is already authenticated",
    },
    403: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              enum: ["error"],
            }),
            message: z.string().openapi({
              default: "registration has been disabled on this server",
            }),
          }),
        },
      },
      description:
        "this response gets sent when the user tries to register while user account creation is disabled",
    },
    409: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              enum: ["error"],
            }),
            message: z.string().openapi({
              default: "username already in use",
            }),
          }),
        },
      },
      description:
        "this response gets sent when trying to register with a username that already exists",
    },
  },
  tags: ["Auth"],
});

auth.openapi(registerRoute, async (c) => {
  const body = await c.req.valid("json");
  const registrationEnabled = await get("registrationEnabled");
  const session = c.get("session");
  const ctxUser = c.get("user");

  if (session || ctxUser) {
    return c.json(
      {
        status: "error",
        message: "already authenticated",
      },
      401
    );
  }

  if (!registrationEnabled) {
    return c.json(
      {
        status: "error",
        message: "registration has been disabled on this server",
      },
      403
    );
  }

  if (await userExists(body.username)) {
    return c.json(
      {
        status: "error",
        message: "username is already in use",
      },
      409
    );
  }

  const user = await createUser(body.username, body.password);
  const sessionCookie = await createSession(user.id);

  c.header("Set-Cookie", sessionCookie.serialize());

  return c.json({
    status: "OK",
  });
});

const loginRoute = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      headers: z.object({
        "Set-Cookie": z.string().openapi({
          example: "auth_session=SESSION_ID",
        }),
      }),
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              enum: ["ok"],
            }),
          }),
        },
      },
      description:
        "this response gets sent when the user successfully logged in",
    },
    403: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              enum: ["error"],
            }),
            message: z.string().openapi({
              default: "already authenticated",
            }),
          }),
        },
      },
      description:
        "this response gets sent when the user tries to log in while already being logged in",
    },
    422: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              enum: ["error"],
            }),
            message: z.string().openapi({
              default: "incorrect username or password",
            }),
          }),
        },
      },
      description:
        "this response gets sent when the user submits incorrect credentials",
    },
  },
  tags: ["Auth"],
});

auth.openapi(loginRoute, async (c) => {
  const { username, password } = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (session || user) {
    return c.json(
      {
        status: "error",
        message: "already authenticated",
      },
      403
    );
  }

  if (!(await userExists(username))) {
    const hashedPassword = hashPassword(password); // hash the password to pretend that an account with that username exists (for security against brute-force attacks)
    return c.json(
      {
        status: "error",
        message: "incorrect username or password",
      },
      422
    );
  }

  const existingUser = await getUser(username);

  const isPasswordValid = await verifyPassword(
    password,
    existingUser.hashed_password
  );

  if (!isPasswordValid)
    return c.json(
      {
        status: "error",
        message: "incorrect username or password",
      },
      422
    );

  const sessionCookie = await createSession(existingUser.id);
  c.header("Set-Cookie", sessionCookie.serialize(), {
    append: true,
  });

  return c.json(
    {
      status: "ok",
    },
    200
  );
});

const getSessionRoute = createRoute({
  method: "get",
  path: "/session",
  request: {
    headers: z.object({
      Cookie: z.string().openapi("Session Cookie", {
        example: "auth_session=SESSION_ID",
      }),
    }),
  },
  responses: {
    200: {
      headers: z.object({
        "Set-Cookie": z.string().openapi({
          example: "auth_session=SESSION_ID",
        }),
      }),
      content: {
        "application/json": {
          schema: z
            .object({
              user_id: z.string(),
              username: z.string(),
              role: z.enum(["admin", "user"]),
            })
            .openapi({
              example: {
                user_id: "xIOAbn_12Znz91",
                username: "bob",
                role: "admin",
              },
            }),
        },
      },
      description:
        "this response gets sent when the user successfully logged in",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              enum: ["error"],
            }),
            message: z.string().openapi({
              default: "unauthorised",
            }),
          }),
        },
      },
      description: "this response gets sent when the user isn't logged in",
    },
  },
  tags: ["Auth"],
});

auth.openapi(getSessionRoute, (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        status: "error",
        message: "unauthorised",
      },
      401
    );
  }

  return c.json({
    user_id: user.id,
    username: user.username,
    role: user.role ?? "user",
  });
});

export { auth };
