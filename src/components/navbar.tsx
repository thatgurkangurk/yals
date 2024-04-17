"use client";
import Link from "next/link";
import { CircleUser, Menu } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import { Login } from "./auth/login";
import { atom, useAtom, useSetAtom } from "jotai";
import { useSession } from "./session-provider";

const sheetOpenAtom = atom(false);

function NavbarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  const setIsOpen = useSetAtom(sheetOpenAtom);
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      className={clsx(
        "transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );
}

export function Navbar({
  registrationEnabled,
}: {
  registrationEnabled: boolean;
}) {
  const [isOpen, setIsOpen] = useAtom(sheetOpenAtom);
  const { user } = useSession();
  const greetings = ["Hello", "Howdy", "Welcome", "Hiya", "Hey", "Hey there"];

  const [greeting, setGreeting] = useState("Howdy");

  const router = useRouter();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <span>yals</span>
        </Link>
        <NavbarLink href="/">Home</NavbarLink>
        <NavbarLink href="/search">Link Searcher</NavbarLink>
        <NavbarLink href="/dashboard">Dashboard</NavbarLink>
      </nav>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
            <NavbarLink href="/">Home</NavbarLink>
            <NavbarLink href="/search">Link Searcher</NavbarLink>
            <NavbarLink href="/dashboard">Dashboard</NavbarLink>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full flex-1 justify-items-end">
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        {user ? (
          <DropdownMenu
            onOpenChange={(open) => {
              if (open) {
                const randomIndex = Math.floor(
                  Math.random() * greetings.length
                );
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

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {greeting}, {user.username}!
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  fetch("/api/auth/signout").then(() => {
                    router.refresh();
                  })
                }
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Login />
            <Register registrationEnabled={registrationEnabled} />
          </>
        )}
      </div>
    </header>
  );
}
