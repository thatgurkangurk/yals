<script lang="ts">
  import type { PageData } from "./$types";
  import RegisterForm from "./register-form.svelte";

  export let data: PageData;
</script>

<h1>welcome!</h1>

{#if data.settings.registrationEnabled}
  <RegisterForm data={data.form} />
{:else}
  <h2 class="text-3xl">registration has been disabled on this server</h2>
  <p>if this is unexpected, please contact the server administrator.</p>
{/if}
