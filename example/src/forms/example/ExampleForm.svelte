<script lang="ts">
  import { onMount } from "svelte";
  import { onSubmit, init, formState } from "./example.form";
  import DynamicForm from "@formvana/lib/generator/DynamicForm.svelte";

  onMount(() => {
    setTimeout(() => {
      init();
    }, 0);
  });

  const handleSubmit = (e) => {
    console.log("MADE IT HERE -- ", e);

    // $formState.validate();
  };
</script>

<DynamicForm form={formState} on:submit={handleSubmit} />
