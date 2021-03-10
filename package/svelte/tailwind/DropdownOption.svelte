<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const toggleHighlight = () => (highlighted = !highlighted);

  let highlighted = false;

  export let id;
  export let label;
  export let value;
  export let selected = false;
</script>

<li
  {id}
  role="option"
  {value}
  on:click={dispatch("click", value)}
  on:mouseenter={toggleHighlight}
  on:mouseleave={toggleHighlight}
  class="relative z-40 py-2 pl-3  {highlighted || selected
    ? 'text-white bg-indigo-600'
    : 'text-gray-900'} cursor-pointer select-none pr-9"
>
  <span class="sr-only">{label}</span>
  <span class="block truncate {selected ? 'font-semibold' : 'font-normal'}">
    {label}
  </span>
  {#if selected}
    <span
      class="absolute inset-y-0 right-0 flex items-center pr-4 {highlighted ||
      selected
        ? 'text-white'
        : 'text-indigo-600'}"
    >
      <!-- Heroicon name: check -->
      <svg
        class="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  {/if}
</li>
