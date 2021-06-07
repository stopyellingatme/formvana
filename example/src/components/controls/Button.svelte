<script>
  export let label;
  export let action = null;
  export let disabled = false;
</script>

<button
  on:click|preventDefault={() => action()}
  {disabled}
  {...$$props}
  class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white {disabled
    ? 'bg-gray-600 cursor-not-allowed'
    : 'bg-gray-800 hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'} border border-transparent rounded-md shadow-sm  focus:outline-none"
>
  {@html label}
</button>
