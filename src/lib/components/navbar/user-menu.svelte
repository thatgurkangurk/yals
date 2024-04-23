<script lang="ts">
  import { Button } from "../ui/button";
  import { enhance } from "$app/forms";
  import { getUser } from "$lib/context";

  const greetings = ["Hello", "Howdy", "Welcome", "Hiya", "Hey", "Hey there"];

  let greeting = "Hello";

  function getGreeting() {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    greeting = greetings[randomIndex];
  }

  getGreeting();

  const user = getUser();
</script>

<div class="flex gap-3 items-center">
  {#if $user !== null}
    <span>{greeting}, {$user.username}</span>
    <form
      method="post"
      action="/auth/logout"
      use:enhance={() => {
        return async ({ update }) => {
          update();
        };
      }}
    >
      <Button variant="link" class="p-1" type="submit">log out</Button>
    </form>
  {:else}
    <a href="/auth/login" class="underline-offset-4 hover:underline">login</a>
    |
    <a href="/auth/register" class="underline-offset-4 hover:underline"
      >register</a
    >
  {/if}
</div>
