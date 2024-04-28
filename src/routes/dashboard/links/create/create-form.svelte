<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { type CreateLinkFormSchema, createLinkFormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  export let data: SuperValidated<Infer<CreateLinkFormSchema>>;

  const form = superForm(data, {
    validators: zodClient(createLinkFormSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="slug">
    <Form.Control let:attrs>
      <Form.Label>slug</Form.Label>
      <Input
        placeholder="my-slug"
        required
        {...attrs}
        bind:value={$formData.slug}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="target">
    <Form.Control let:attrs>
      <Form.Label>target</Form.Label>
      <Input required {...attrs} type="url" bind:value={$formData.target} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>create</Form.Button>
</form>
