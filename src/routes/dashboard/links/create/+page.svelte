<script lang="ts">
  import type { PageData } from "./$types";
  import CreateForm from "./create-form.svelte";

  export let data: PageData;
</script>

<h1 class="text-3xl">create a link</h1>
<CreateForm data={data.form} />
