<script lang="ts">
  import { onMount } from "svelte";
  import { onSubmit, init, formState } from "./example.form";
  import DynamicForm from "@formvana/lib/svelte/DynamicForm.svelte";

  onMount(() => {
    setTimeout(() => {
      init();
    }, 0);
  });
</script>

<DynamicForm
  form={formState}
  on:submit={(e) => console.log("MADE IT HERE -- ", e)}
/>
