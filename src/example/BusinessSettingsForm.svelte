<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { onSubmit, init, formState } from "./stores/business.settings.form";
  import Form from "../../package/svelte/Form.svelte";

  onMount(() => {
    setTimeout(() => {
      init();
    }, 0);
  });

  onDestroy(() => {
    handleDestroy();
  });
  const handleDestroy = () => {
    $formState.destroy();
  };

  $: valid = $formState.valid;
  $: changed = $formState.changed;
</script>

<Form form={formState} on:submit={onSubmit} on:destroy={handleDestroy}>
  <div slot="header">
    <h2 class="text-lg font-medium leading-6 text-gray-900">
      Business Settings
    </h2>
    <p class="mt-1 text-sm text-gray-500">
      This is a test. This is only a test. Bleep bloop.
    </p>
  </div>

  <div slot="buttons" class="px-4 py-3 text-right bg-gray-50 sm:px-6">
    {#if $changed}
      <button
        on:click|preventDefault={$formState.reset}
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Reset
      </button>
    {:else}
      <button
        disabled
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none"
      >
        Reset
      </button>
    {/if}
    {#if $valid}
      <button
        type="submit"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Save
      </button>
    {:else}
      <button
        disabled
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none"
      >
        Save
      </button>
    {/if}
  </div>
</Form>
