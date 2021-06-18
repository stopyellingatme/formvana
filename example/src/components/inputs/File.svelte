<script>
  export let field;
  let name = field.name;

  $: value = field.value;
  $: attributes = Object.assign({}, field.attributes || {});

  const reset = () => ($value = undefined);
</script>

<div class="sm:col-span-6">
  <label for={`header_${name}`} class="block text-sm font-medium text-gray-700">
    {field.label}
  </label>
  <div
    class="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md"
  >
    {#if !$value}
      <div class="space-y-1 text-center">
        <svg
          class="w-12 h-12 mx-auto text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="flex text-sm text-gray-600">
          <label
            for={name}
            class="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            Upload a file
            <input
              {name}
              bind:value={$value}
              {...attributes}
              type="file"
              class="sr-only"
            />
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    {:else}
      <div class="space-y-1 text-center">
        <button
          on:click={reset}
          type="button"
          class="p-4 text-lg text-gray-900 border-4 border-indigo-700 border-dashed rounded hover:border-indigo-400"
          >Remove File</button
        >
      </div>
    {/if}
  </div>
</div>
