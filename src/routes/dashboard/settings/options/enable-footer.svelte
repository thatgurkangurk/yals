<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
  
    export let isEnabled: boolean;
  </script>
  
  <Card.Root>
    <Card.Header class="pb-3">
      <Card.Title>Show/hide Footer</Card.Title>
      <Card.Description class="max-w-lg text-balance leading-relaxed">
        If this is enabled, there will be a footer showing that you use yals.
        Please keep this enabled to spread the word about yals.
      </Card.Description>
    </Card.Header>
    <Card.Footer>
      {#if isEnabled}
        <Button formaction="?/footer" type="submit" variant={"destructive"}
          >Hide footer</Button
        >
      {:else}
        <Button formaction="?/footer" type="submit"
          >Show footer</Button
        >
      {/if}
    </Card.Footer>
  </Card.Root>