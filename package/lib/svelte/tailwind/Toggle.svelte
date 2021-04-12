<script lang="ts">
  import { onMount } from "svelte";

  export let valueStore;
  export let useInput;
  export let errorsStore;

  export let label;
  export let subLabel = "";
  export let labelPos = 0; // 0 == left; 1 == right;
  export let checked = false;
  export let srText = "";

  let node;
  const toggle = (e) => {
    checked = !checked;
    $valueStore = checked;
    node.dispatchEvent(new Event("change"));
  };

  onMount(() => {
    checked = $valueStore;
  });
</script>

<div class="flex items-center justify-between">
  {#if labelPos === 0}
    <span class="flex flex-col flex-grow" id="toggleLabel">
      <span class="text-sm font-medium text-gray-900">{label}</span>
      {#if subLabel}
        <span class="text-sm leading-normal text-gray-500">{subLabel}</span>
      {/if}
    </span>
  {/if}
  <button
    on:click={toggle}
    type="button"
    use:useInput
    bind:this={node}
    aria-pressed="false"
    aria-labelledby="toggleLabel"
    class="relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out {checked
      ? 'bg-indigo-600'
      : 'bg-gray-200'} border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <span class="sr-only">{srText}</span>
    <span
      aria-hidden="true"
      class="inline-block w-5 h-5 transition duration-200 ease-in-out transform translate-x-{checked
        ? 5
        : 0} bg-white rounded-full shadow ring-0"
    />
  </button>
  {#if labelPos === 1}
    <span class="flex flex-col flex-grow ml-3" id="toggleLabel">
      <span class="text-sm font-medium text-gray-900">{label}</span>
      {#if subLabel}
        <span class="text-sm leading-normal text-gray-500">{subLabel}</span>
      {/if}
    </span>
  {/if}
</div>
