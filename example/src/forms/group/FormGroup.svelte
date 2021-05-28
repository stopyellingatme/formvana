<script lang="ts">
  import { onMount } from "svelte";
  import { onSubmit, init, formState } from "./group.form";
  import DynamicForm from "../DynamicForm.svelte";
  import { writable } from "svelte/store";

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

{#each $formState.forms as form}
  <DynamicForm form={writable(form)} on:submit={handleSubmit} />
{/each}
