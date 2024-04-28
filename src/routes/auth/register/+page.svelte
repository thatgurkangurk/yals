<script lang="ts">
  import type { PageData } from "./$types";
  import RegisterForm from "./register-form.svelte";

  export let data: PageData;
</script>

<h1>welcome!</h1>
<RegisterForm data={data.form} />
