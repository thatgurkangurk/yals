<script lang="ts">
    import type { ZodIssue } from "zod";

    export let issues: ZodIssue[];
</script>

<ul>
    {#each issues as { message, path }}
        <li>
            {String(path[0]).charAt(0).toUpperCase() + String(path[0]).slice(1)} -
            {message}
        </li>
    {/each}
</ul>