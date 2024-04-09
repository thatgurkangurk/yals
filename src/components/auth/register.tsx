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
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { register } from "@/lib/auth/actions";

export function Register() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const text = {
    button: "Register",
    title: "Welcome to yals!",
    description:
      "We're so happy to see you here! Create an account to get started making short links!",
  };

  if (isDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full"
            >
              {text.button}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{text.title}</DialogTitle>
              <DialogDescription>{text.description}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="justify-start relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full"
            >
              {text.button}
            </Button>
          </DropdownMenuItem>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{text.title}</DrawerTitle>
            <DrawerDescription>{text.description}</DrawerDescription>
          </DrawerHeader>
          <RegisterForm className="px-4" />
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

interface FormValues {
  username: string;
  password: string;
}

export function RegisterForm({ className }: React.ComponentProps<"form">) {
  const { register: formRegister } = useForm<FormValues>();

  return (
    <form className={cn("grid items-start gap-4", className)} action={register}>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          {...formRegister("username")}
          placeholder="thatgurkangurk"
        />{" "}
      </div>{" "}
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input {...formRegister("password")} type="password" />{" "}
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
}
