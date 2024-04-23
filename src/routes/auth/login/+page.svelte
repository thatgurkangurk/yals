<script lang="ts">
	import { enhance } from "$app/forms";
    import ZodIssues from "$lib/components/ZodIssues.svelte";

    export let form;
</script>

<h1>Sign in</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<button>Continue</button>
</form>

{#if form?.issues}
    <ZodIssues issues={form.issues} />
{/if}