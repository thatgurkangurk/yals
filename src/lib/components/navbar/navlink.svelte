<script lang="ts">
  import { page } from "$app/stores";

  export let href: string;
  export let alwaysActive = false;
  export let onClick: () => void = () => null;

  let isActive = $page.url.pathname === href || alwaysActive;
</script>

<a
  on:click={onClick}
  {href}
  class={`flex items-center gap-2 font-semibold ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"} ${alwaysActive ? "text-lg" : ""}`}
>
  <slot />
</a>
