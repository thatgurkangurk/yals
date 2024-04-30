<script lang="ts">
  import NavLink from "$lib/components/navbar/navlink.svelte";
  import type { User } from "lucia";

  export let user: User | null;
</script>

<div class="flex gap-3 py-2">
  <NavLink href="/dashboard/links">links</NavLink>
  {#if user?.role === "admin"}
    <NavLink href="/dashboard/settings">server settings</NavLink>
  {/if}
</div>
