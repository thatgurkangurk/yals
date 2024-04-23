<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import SpaceGrotesk from "$lib/fonts/SpaceGroteskVariable.woff2";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  import type { LayoutServerData } from "./$types";
  import { setUser } from "$lib/context";

  export let data: LayoutServerData;

  $: {
    setUser(data.user);
  }
</script>

<ModeWatcher />
<link
  rel="preload"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
  href={SpaceGrotesk}
/>

<div class="flex min-h-screen w-full flex-col">
  <Navbar />

  <main class="p-4">
    <slot />
  </main>
</div>
