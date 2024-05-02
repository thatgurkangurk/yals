<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { CircleUser } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
    import { enhance } from "$app/forms";
    import { getUser } from "$lib/context";

    let form: HTMLFormElement;

    const user = getUser();
</script>

{#if $user !== null}

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="secondary"
        size="icon"
        class="rounded-full"
      >
        <CircleUser class="h-5 w-5" />
        <span class="sr-only">Toggle user menu</span>
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Label>My Account</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.Item href="/dashboard/links">Dashboard</DropdownMenu.Item>
      <DropdownMenu.Item href="/user/settings">User Settings</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <form bind:this={form} method="post" action="/auth/logout" use:enhance={() => {
        return async ({ update }) => {
            update();
        }
      }}>
          <DropdownMenu.Item on:click={() => {
             form.requestSubmit(); //! there is probably a better way to do this, but I don't know...
          }}>Logout</DropdownMenu.Item>
      </form>
    </DropdownMenu.Content>
</DropdownMenu.Root>
{:else}
<a href="/auth/login" class="underline-offset-4 hover:underline">login</a>
    |
<a href="/auth/register" class="underline-offset-4 hover:underline">register</a>
{/if}