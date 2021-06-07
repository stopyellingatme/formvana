<script lang="ts">
  import { onMount, tick } from "svelte";
  import { onSubmit, init, form_state } from "./example.form";
  import DynamicForm from "../../DynamicForm.svelte";

  onMount(() => {
    tick();
    init();
  });

  const handleSubmit = (e) => {
    console.log("MADE IT HERE -- ", e);
  };
</script>

<!-- <DynamicForm form={form_state} on:submit={handleSubmit} /> -->

<!-- 
  /\ /\ /\ 
  || || ||
  Either of these will work!  
  || || ||
  \/ \/ \/
-->

<svelte:component
  this={$form_state.template}
  form={form_state}
  {...$$props}
  on:submit={handleSubmit}
/>
