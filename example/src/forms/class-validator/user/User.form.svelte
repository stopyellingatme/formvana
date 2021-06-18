<script lang="ts">
  import { onMount, tick, onDestroy } from "svelte";
  import { onSubmit, init, form_state } from "./user.form";
  import DynamicForm from "../../DynamicForm.svelte";
  import ButtonArea from "../../../components/controls/ButtonArea.svelte";
  import { writable } from "svelte/store";

  onMount(() => {
    tick();
    init();
  });

  onDestroy(() => {
    $form_state.destroy();
  });

  const handleSubmit = (e) => {
    console.log("MADE IT TO THE handleSubmit FUNCTION -- ", e);
  };

  $: valid = $form_state.all_valid;
  $: changed = $form_state.any_changed;
  $: active_step = $form_state.active_step;
</script>

<div class="w-screen max-w-7xl">
  {#each $form_state.forms as form, current_index}
    {#if current_index === $active_step}
      <svelte:component
        this={form.template}
        form={writable(form)}
        {current_index}
        {...$$props}
        on:event={(e) => handleSubmit(e)}
      />

      <!-- 
        /\ /\ /\ 
        || || ||

        Either of these will work!  

        || || ||
        \/ \/ \/
      -->

      <!-- <DynamicForm
        {current_index}
        form={writable(form)}
        on:submit={handleSubmit}
      /> -->
    {/if}
  {/each}

  <!-- Button Area -->
  <div class="px-8 py-2 pb-12 mx-auto max-w-7xl">
    <ButtonArea
      reset={$form_state.resetAll}
      {valid}
      {changed}
      stepper_data={$form_state}
    />
  </div>
</div>
