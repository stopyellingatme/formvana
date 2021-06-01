<script>
  // your script goes here

  export let changed;
  export let valid;
  export let reset;
</script>

<!-- Button Area -->
<div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
  {#if $changed}
    <button
      on:click|preventDefault={reset}
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
