<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";

  export let isEnabled: boolean;
</script>

<Card.Root>
  <Card.Header class="pb-3">
    <Card.Title>Server Registration</Card.Title>
    <Card.Description class="max-w-lg text-balance leading-relaxed">
      If this is disabled, no one will be able to make a new account on this
      server. Useful for private instances.
    </Card.Description>
  </Card.Header>
  <Card.Footer>
    {#if isEnabled}
      <Button formaction="?/registration" type="submit" variant={"destructive"}
        >Disable Registration</Button
      >
    {:else}
      <Button formaction="?/registration" type="submit"
        >Enable Registration</Button
      >
    {/if}
  </Card.Footer>
</Card.Root>
