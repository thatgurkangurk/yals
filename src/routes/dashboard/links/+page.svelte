<script lang="ts">
  import type { PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";

  export let data: PageData;
</script>

<h1>dashboard</h1>

<a href="/dashboard/links/create"><Button>create a link</Button></a>

<br />

{#if data.links.length}
  <h3 class="py-3 text-2xl">your links ({data.links.length})</h3>

  <div class="grid md:grid-cols-2 gap-2">
    {#each data.links as link}
      <Card.Root>
        <Card.Header class="pb-2">
          <Card.Description>{link.id}</Card.Description>
          <Card.Title class="text-4xl">{link.slug}</Card.Title>
        </Card.Header>
        <Card.Footer>
          <a href={`/dashboard/links/${link.id}`}>
            <Button>manage</Button>
          </a>
        </Card.Footer>
      </Card.Root>
    {/each}
  </div>
{:else}
  <p>you do not have any links</p>
{/if}
