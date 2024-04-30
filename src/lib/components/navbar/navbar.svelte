<script lang="ts">
  import { Button } from "../ui/button";
  import * as Sheet from "../ui/sheet";
  import Menu from "lucide-svelte/icons/menu";
  import NavLink from "./navlink.svelte";
  import UserMenu from "./user-menu.svelte";
  import { writable } from "svelte/store";

  type Link = {
    href: string;
    text: string;
    alwaysActive?: boolean;
  };

  const links: Link[] = [
    {
      href: "/",
      text: "yals",
      alwaysActive: true,
    },
    {
      href: "/",
      text: "Home",
    },
    {
      href: "/search",
      text: "Link Searcher",
    },
    {
      href: "/dashboard",
      text: "Dashboard",
    },
  ];

  let sheetOpen = writable(false);
</script>

<header
  class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 [grid-area:header]"
>
  <nav
    class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
  >
    {#each links as link}
      <NavLink href={link.href} alwaysActive={link.alwaysActive}
        >{link.text}</NavLink
      >
    {/each}
  </nav>
  <Sheet.Root
    bind:open={$sheetOpen}
    onOpenChange={(open) => {
      sheetOpen.set(open);
    }}
  >
    <Button
      variant="outline"
      size="icon"
      class="shrink-0 md:hidden"
      on:click={() => sheetOpen.set(true)}
    >
      <Menu class="h-5 w-5" />
      <span class="sr-only">Toggle navigation menu</span>
    </Button>
    <Sheet.Content side="left">
      <nav class="grid gap-6 text-lg font-medium">
        {#each links as link}
          <NavLink
            onClick={() => {
              sheetOpen.set(false);
            }}
            href={link.href}
            alwaysActive={link.alwaysActive}>{link.text}</NavLink
          >
        {/each}
      </nav>
    </Sheet.Content>
  </Sheet.Root>
  <div
    class="justify-items-end flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4"
  >
    <div class="ml-auto flex-1 sm:flex-initial"></div>
    <UserMenu />
  </div>
</header>
