<script lang="ts">
	import { enhance } from "$app/forms";
    import ZodIssues from "$lib/components/ZodIssues.svelte";

    export let form;
</script>

<h1>register</h1>
<form method="post" use:enhance>
	<label for="username">Username</label>
	<input name="username" id="username" required /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" required/><br />
    <label for="password-confirm">confirm password</label>
    <input type="password" name="password-confirm" id="password-confirm" required /><br />
    <button>Continue</button>
</form>

{#if form?.issues}
    <ZodIssues issues={form.issues} />
{/if}