<script lang="ts">
  import type { PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";

  export let data: PageData;
</script>

<Button class="w-fit">
  <a href={"/dashboard"}>back to dashboard</a>
</Button>

<div>
  <h2>link: {data.link.slug}</h2>
  <p>work in progress...</p>
</div>
