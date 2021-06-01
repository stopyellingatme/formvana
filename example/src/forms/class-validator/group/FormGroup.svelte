<script lang="ts">
  import { onMount, tick, onDestroy } from "svelte";
  import { onSubmit, init, form_state } from "./group.form";
  import DynamicForm from "../../DynamicForm.svelte";
  import { writable } from "svelte/store";

  onMount(() => {
    tick();
    init();
  });

  onDestroy(() => {
    // $form_state.destroy();
  });

  const handleSubmit = (e) => {
    console.log("MADE IT HERE -- ", e);
  };

  $: valid = $form_state.all_valid;
  $: changed = $form_state.any_changed;
</script>

{#each $form_state.forms as form, i}
  <DynamicForm form={writable(form)} group_num={i} on:submit={handleSubmit} />
{/each}
<!-- Button Area -->
<div class="px-8 py-2 pb-12 mx-auto max-w-7xl">
  <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
    {#if $changed}
      <button
        on:click|preventDefault={() => $form_state.resetAll()}
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Changed
      </button>
    {:else}
      <button
        disabled
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none"
      >
        Unchanged
      </button>
    {/if}
    {#if $valid}
      <button
        type="submit"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Valid
      </button>
    {:else}
      <button
        disabled
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none"
      >
        Invalid
      </button>
    {/if}
    {#if $valid && $changed}
      <button
        type="submit"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Valid &amp; Changed
      </button>
    {:else}
      <button
        disabled
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none"
      >
        Invalid OR Unchanged
      </button>
    {/if}
  </div>
</div>
