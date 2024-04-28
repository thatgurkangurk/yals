<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import * as Alert from "$lib/components/ui/alert";
  import { InfoIcon, OctagonAlert } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card";
  import { enhance } from "$app/forms";

  export let data: PageData;
  export let form: ActionData;
</script>

<Button class="w-fit">
  <a href={"/dashboard"}>back to dashboard</a>
</Button>

<div>
  <h2>link: {data.link.slug}</h2>
  {#if data.link.clicks === 0}
    <Alert.Root>
      <InfoIcon className="h-4 w-4" />
      <Alert.Title>No statistics yet.</Alert.Title>
      <Alert.Description>
        No one has used your link yet. When they do, you will be able to see it
        here.
      </Alert.Description>
    </Alert.Root>
  {:else}
    <div class="py-4">
      <h3 class="text-xl font-bold">link statistics</h3>
      <div class="grid grid-cols-2 md:grid-cols-4">
        <Card.Root>
          <Card.Header
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <Card.Title class="text-lg font-medium">
              Link Clicks (lifetime)
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div class="text-2xl font-bold">{data.link.clicks}</div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  {/if}
</div>

{#if form?.error}
  <Alert.Root>
    <OctagonAlert class="h-4 w-4" />
    <Alert.Title>error</Alert.Title>
    <Alert.Description>
      something went wrong when deleting: {form.error}
    </Alert.Description>
  </Alert.Root>
{/if}

<form method="post" action="?/delete" class="pt-4" use:enhance>
  <Button type="submit" variant="destructive">delete</Button>
</form>
