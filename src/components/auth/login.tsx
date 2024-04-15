"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FieldErrors,
  FieldPath,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { ActionState, login } from "@/lib/auth/actions";
import { loginFormSchema } from "@/lib/auth/validation";
import { atom, useAtom, useSetAtom } from "jotai";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";

const openAtom = atom(false);

export function Login() {
  const [open, setOpen] = useAtom(openAtom);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const text = {
    button: "login",
    title: "Welcome back!",
    description: "Log in to manage your short links!",
  };

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="link">{text.button}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{text.title}</DialogTitle>
              <DialogDescription>{text.description}</DialogDescription>
            </DialogHeader>
            <LoginForm className="px-4" />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="link">{text.button}</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{text.title}</DrawerTitle>
            <DrawerDescription>{text.description}</DrawerDescription>
          </DrawerHeader>
          <LoginForm className="px-4" />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

type FormValues = z.infer<typeof loginFormSchema>;

function LoginFormContent({
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
        <Label htmlFor="username">Username</Label>
        <Input {...register("username")} placeholder="thatgurkangurk" />{" "}
        <ErrorMessage name="username" errors={errors} />
      </div>
      <div className="grid gap-2 pb-48 md:pb-0">
        <Label htmlFor="password">Password</Label>
        <Input {...register("password")} type="password" />{" "}
        <ErrorMessage name="password" errors={errors} />
      </div>
      <Button type="submit" disabled={pending || !isValid}>
        Login
      </Button>
      {pending && <span>loading...</span>}
    </>
  );
}

export function LoginForm({ className }: React.ComponentProps<"form">) {
  const router = useRouter();
  const setOpen = useSetAtom(openAtom);
  const {
    register: formRegister,
    formState: { isValid, errors },
    setError,
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(loginFormSchema),
  });
  const [state, formAction] = useFormState<ActionState, FormData>(login, null);

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
      setOpen(false);
      router.push("/dashboard");
    }
  }, [router, setError, setOpen, state]);

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      action={formAction}
    >
      <LoginFormContent
        register={formRegister}
        isValid={isValid}
        errors={errors}
      />
    </form>
  );
}
