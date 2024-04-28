<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { searchFormSchema, type SearchFormSchema } from "./validation";

  export let data: SuperValidated<Infer<SearchFormSchema>>;

  const form = superForm(data, {
    validators: zodClient(searchFormSchema),
    resetForm: false,
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="slug">
    <Form.Control let:attrs>
      <Form.Label>slug</Form.Label>
      <Input required {...attrs} bind:value={$formData.slug} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>search</Form.Button>
</form>
