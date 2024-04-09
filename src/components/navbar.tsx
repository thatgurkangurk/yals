"use client";
import { User } from "lucia";
import Link from "next/link";
import { CircleUser, Menu } from "lucide-react";
import useSWR, { Fetcher } from "swr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import clsx from "clsx";
import React, { useState } from "react";
import { Register } from "./auth/register";

function NavbarLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}

const fetcher: Fetcher<User | null, string> = (url) =>
  fetch(url).then((r) => r.json());

export function Navbar() {
  const { data: user, mutate: refetchUser } = useSWR(
    "/api/auth/get-user",
    fetcher
  );
  const greetings = ["Hello", "Howdy", "Welcome", "Hiya", "Hey", "Hey there"];

  const [greeting, setGreeting] = useState("Howdy");

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <span>yals</span>
        </Link>
        <NavbarLink href="/dashboard" isActive>
          Dashboard
        </NavbarLink>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <span>yals</span>
            </Link>
            <NavbarLink href="/dashboard" isActive>
              Dashboard
            </NavbarLink>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full flex-1 justify-items-end">
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) {
              const randomIndex = Math.floor(Math.random() * greetings.length);
              const selectedGreeting = greetings[randomIndex];
              setGreeting(selectedGreeting);
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          {user ? (
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {greeting}, {user.username}!
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>something</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Not logged in</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Register />
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </header>
  );
}
