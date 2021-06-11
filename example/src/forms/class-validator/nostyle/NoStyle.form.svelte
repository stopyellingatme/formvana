<script lang="ts">
  import { onMount, tick, onDestroy } from "svelte";
  import { onSubmit, init, form_state } from "./nostyle.form";
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
    console.log("MADE IT HERE -- ", e);
  };

  $: valid = $form_state.all_valid;
  $: changed = $form_state.any_changed;
</script>

{#each $form_state.forms as form, i}
  <div id="forms">
    <DynamicForm form={writable(form)} group_num={i} on:submit={handleSubmit} />
  </div>
{/each}

<!-- Button Area -->
<div class="px-8 py-2 pb-12 mx-auto max-w-7xl">
  <ButtonArea reset={$form_state.resetAll} {valid} {changed} />
</div>

<style>
  #forms {
    display: flex;
		flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
		width: 100%;
  }
	
	
</style>
