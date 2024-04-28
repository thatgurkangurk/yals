<script lang="ts">
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";
  export let data: PageData;
</script>

<h1 class="text-3xl">welcome to the yals rewrite!</h1>
<p>
  see progress <a
    href="https://github.com/thatgurkangurk/yals/pull/9"
    class="underline">here</a
  >
</p>

{#if data.username}
  <p>hello, {data.username}</p>
  <form method="post" action="/auth/logout" use:enhance>
    <button>log out</button>
  </form>
{/if}
