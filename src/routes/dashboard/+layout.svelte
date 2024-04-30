<script lang="ts">
  import DashboardNav from "./dashboard-nav.svelte";

  export let data: import("./$types").LayoutData;
</script>

<DashboardNav user={data.user} />

<slot />
