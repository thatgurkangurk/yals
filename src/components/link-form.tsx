"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionState, createLinkAction } from "@/lib/link/actions";
import { linkFormSchema } from "@/lib/link/validation";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormStatus, useFormState } from "react-dom";
import {
  FieldErrors,
  FieldPath,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof linkFormSchema>;

function CreateLinkFormContent({
  register,
  isValid,
  errors,
}: {
  register: UseFormRegister<FormValues>;
  isValid: boolean;
  errors: FieldErrors<FormValues>;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="slug">Slug</Label>
        <Input {...register("slug")} placeholder="my-slug" />{" "}
        <ErrorMessage name="slug" errors={errors} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="target">Target</Label>
        <Input {...register("target")} type="url" />{" "}
        <ErrorMessage name="target" errors={errors} />
      </div>
      <Button type="submit" disabled={pending || !isValid}>
        Create
      </Button>
      {pending && <span>loading...</span>}
    </>
  );
}

export function CreateLinkForm({ className }: React.ComponentProps<"form">) {
  const router = useRouter();
  const {
    register: formRegister,
    formState: { isValid, errors },
    setError,
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(linkFormSchema),
  });
  const [state, formAction] = useFormState<ActionState, FormData>(
    createLinkAction,
    null
  );

  useEffect(() => {
    if (!state) return;

    if (state.status === "error") {
      state.errors?.forEach((error) => {
        setError(error.path as FieldPath<FormValues>, {
          message: error.message,
        });
      });
    }

    if (state.status === "ok") {
      alert("OK!");
    }
  }, [router, setError, state]);

  return (
    <form
      className={cn("grid items-start gap-4 pt-4", className)}
      action={formAction}
    >
      <CreateLinkFormContent
        register={formRegister}
        isValid={isValid}
        errors={errors}
      />
    </form>
  );
}
