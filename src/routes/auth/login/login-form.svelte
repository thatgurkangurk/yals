<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { loginFormSchema } from "$lib/user";
  import { type LoginFormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  export let data: SuperValidated<Infer<LoginFormSchema>>;

  const form = superForm(data, {
    validators: zodClient(loginFormSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control let:attrs>
      <Form.Label>username</Form.Label>
      <Input required {...attrs} bind:value={$formData.username} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="password">
    <Form.Control let:attrs>
      <Form.Label>password</Form.Label>
      <Input
        required
        {...attrs}
        type="password"
        bind:value={$formData.password}
      />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>login</Form.Button>
</form>
