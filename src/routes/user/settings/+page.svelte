<script lang="ts">
    import type { PageData } from "./$types";
    export let data: PageData;
</script>

<h2 class="text-3xl">user settings</h2>
<p>currently logged in as: {data.user.username}</p>
<p>wip</p>