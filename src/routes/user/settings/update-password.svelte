<script lang="ts">
    import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
    import type { UpdatePasswordSchema } from "./schemas";

    export let data: SuperValidated<Infer<UpdatePasswordSchema>>;

    const { form, errors, enhance } = superForm(data);
</script>

<p>wip update password form</p>