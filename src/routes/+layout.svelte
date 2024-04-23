<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  import SpaceGrotesk from "$lib/fonts/SpaceGroteskVariable.woff2";
</script>

<ModeWatcher />
<link
  rel="preload"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
  href={SpaceGrotesk}
/>
<slot />
