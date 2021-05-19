<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import LoadingIndicator from "../components/inputs/LoadingIndicator.svelte";
  import Field from "../components/inputs/Field.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /**
   * REQUIRED!
   *
   * You must export a form variable if this component
   * is being used in DynamicForm.
   */
  export let form;

  const handleSubmit = (e) => {
    console.log(e);

    dispatch("event", e);
  };

  onMount(() => {});

  onDestroy(() => {
    $form.destroy();
  });

  $: valid = $form.valid;
  $: changed = $form.changed;
  $: loading = $form.loading;

  let fw, fh;
</script>

<form
  on:submit|preventDefault={handleSubmit}
  bind:clientHeight={fh}
  bind:clientWidth={fw}
>
  <div class="shadow sm:rounded-md">
    <LoadingIndicator visible={$loading} w={fw} h={fh} />
    <div class="px-4 py-6 bg-white sm:p-6">
      <!-- Header Area -->
      <div>
        <h2 class="text-lg font-medium leading-6 text-gray-900">
          Example Form
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          This is a test. This is only a test. Bleep bloop.
        </p>
      </div>

      <!-- Form Wrapper Div (col num, col gaps, etc.) -->
      <div class="grid grid-cols-4 gap-6 mt-6">
        <!-- This is where the Form Generator Magic happens! -->
        {#each $form.fields as field, i}
          <Field {field} {form} />
        {/each}
      </div>
    </div>
    <!-- Button Area -->
    <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
      {#if $changed}
        <button
          on:click|preventDefault={$form.reset}
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
</form>
