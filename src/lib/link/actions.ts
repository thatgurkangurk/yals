"use server";
import { ZodError } from "zod";
import { redirect } from "next/navigation";
import { deleteLinkFormSchema, linkFormSchema } from "./validation";
import { createLink, deleteLink, getLinkById } from "./links";
import { getUser } from "../auth/config";
import { revalidatePath } from "next/cache";

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

export async function deleteLinkAction(data: FormData): Promise<ActionState> {
  try {
    const { id } = deleteLinkFormSchema.parse(data);
    const { user } = await getUser();

    if (!user) {
      return {
        status: "error",
        message: "unauthorised",
      };
    }

    const link = await getLinkById(id);

    if (user.id !== link.userId) {
      return {
        status: "error",
        message: "you do not have permission to delete this link",
      };
    }

    const result = await deleteLink(id);

    if (result.status === "ok") {
      revalidatePath(`/dashboard/links/${id}`);
      return {
        status: "ok",
      };
    }

    return {
      status: "error",
      message: "something went wrong",
    };
  } catch (e) {
    return {
      status: "error",
      message: "failed to delete",
    };
  }
}

export async function createLinkAction(
  prevState: ActionState | null,
  data: FormData
): Promise<ActionState> {
  try {
    const { slug, target } = linkFormSchema.parse(data);
    const { user } = await getUser();

    if (!user) {
      return {
        status: "error",
        message: "unauthorised",
      };
    }

    const link = await createLink(slug, target, user.id);

    redirect(`/dashboard/links/${link.id}`);
  } catch (e: any) {
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

    if (e.code) {
      if (e.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return {
          status: "error",
          message: "invalid form data",
          errors: [
            {
              path: "slug",
              message: "slug is not unique",
            },
          ],
        };
      }
    }

    return {
      status: "error",
      message: "something went wrong. please try again",
    };
  }
}
