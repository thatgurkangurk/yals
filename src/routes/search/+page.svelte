<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import SearchForm from "./search-form.svelte";
  import * as Alert from "$lib/components/ui/alert";
  import Button from "$lib/components/ui/button/button.svelte";
  import { InfoIcon, OctagonAlert } from "lucide-svelte";

  export let data: PageData;

  const { message } = superForm(data.form);
</script>

<h1 class="text-3xl">link searcher</h1>

<SearchForm data={data.form} />

{#if $message}
  <div class="pt-2">
    {#if $message.status === "OK"}
      <Alert.Root variant="default">
        <InfoIcon class="h-4 w-4" />
        <Alert.Title>{$message.slug} redirects to</Alert.Title>
        <Alert.Description>
          {$message.target}
          |
          <a href={$message.slug}>
            <Button variant="link" class="px-0">open</Button>
          </a>
        </Alert.Description>
      </Alert.Root>
    {:else if $message.status === "FAIL"}
      <Alert.Root variant="destructive">
        <OctagonAlert class="h-4 w-4" />
        <Alert.Title>error</Alert.Title>
        <Alert.Description>
          {$message.message}
        </Alert.Description>
      </Alert.Root>
    {/if}
  </div>
{/if}
