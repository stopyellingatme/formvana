<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { onSubmit, init, formState } from "./business.settings.form";
  import Form from "../../../inputs/Form.svelte";

  onMount(() => {
    setTimeout(() => {
      init();
    }, 0);
  });

  onDestroy(() => {});
  const handleDestroy = () => {
    // Hanlde it.
  };
</script>

<Form form={formState} on:submit={onSubmit} on:destroy={handleDestroy}>
  <div slot="header">
    <h2
      id="payment_details_heading"
      class="text-lg font-medium leading-6 text-gray-900"
    >
      Business Details
    </h2>
    <p class="mt-1 text-sm text-gray-500">
      This information will be displayed publicly so be careful what you share.
    </p>
  </div>

  <div slot="buttons_valid" class="px-4 py-3 text-right bg-gray-50 sm:px-6">
    <button
      type="submit"
      class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
    >
      Save
    </button>
  </div>
  <div slot="buttons_disabled" class="px-4 py-3 text-right bg-gray-50 sm:px-6">
    <button
      disabled
      class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none"
    >
      Save
    </button>
  </div>
</Form>
