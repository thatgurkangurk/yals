<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { toast } from "svelte-sonner";
  import type { PageData } from "./$types";
  import EnableRegistration from "./options/enable-registration.svelte";
  import EnableFooter from "./options/enable-footer.svelte";
  import { CheckCircleIcon } from "lucide-svelte";
  import { invalidate, invalidateAll } from "$app/navigation";

  export let data: PageData;
</script>

<h2 class="text-3xl">server settings</h2>

<form
  method="POST"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "success") {
        toast.success("success", {
          description: "successfully applied setting",
        });

        await invalidateAll();
      } else if (result.type === "failure") {
        toast.error("error", {
          description: `${result.data?.message || "unexpected error"}`,
        });
      }

      applyAction(result);
    };
  }}
  class="pt-4 grid md:grid-cols-4 gap-2"
>
  <EnableRegistration isEnabled={data.settings.registrationEnabled} />
  <EnableFooter isEnabled={data.settings.footerEnabled} />
</form>
