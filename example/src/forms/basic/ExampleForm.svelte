<script lang="ts">
  import { onMount, tick } from "svelte";
  import { onSubmit, init, formState } from "./example.form";
  import DynamicForm from "../DynamicForm.svelte";

  let inited = false;
  onMount(() => {
    tick();
    if (!inited) {
      init();
      inited = true;
    }
  });

  const handleSubmit = (e) => {
    console.log("MADE IT HERE -- ", e);

    // $formState.validate();
  };
</script>

<DynamicForm form={formState} on:submit={handleSubmit} />
