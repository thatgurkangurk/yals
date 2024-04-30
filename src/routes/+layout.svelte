<script lang="ts">
  import "../app.css";
  import "$lib/nprogress.css";
  import { ModeWatcher } from "mode-watcher";
  import SpaceGrotesk from "$lib/fonts/SpaceGroteskVariable.woff2";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  import type { LayoutServerData } from "./$types";
  import { setUser } from "$lib/context";
  import { navigating } from "$app/stores";
  import nProgress from "nprogress";
  import { Toaster } from "$lib/components/ui/sonner";
  import Footer from "$lib/components/footer.svelte";

  export let data: LayoutServerData;

  nProgress.configure({
    minimum: 0.16,
    trickle: true,
  });

  $: {
    setUser(data.user);

    if ($navigating) {
      nProgress.start();
    }

    if (!$navigating) {
      nProgress.done();
    }
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

<div class="min-h-[100dvh] w-full flex flex-col">
  <Toaster />
  <Navbar />

  <main class="p-2 flex-grow">
    <slot />
  </main>

  {#if data.settings.footerEnabled}
      <Footer />
  {/if}
</div>