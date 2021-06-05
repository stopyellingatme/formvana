<script>
  // your script goes here

  export let field;
  export let option;
  export let index;

  $: value = field.value;

  /** This allows us to update attributes dynamically */
  $: attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false,
    },
    field.attributes || {}
  );
</script>

<div class="relative flex items-start">
  <div class="flex items-center h-5">
    <input
      name={field.name}
      bind:value={option.value}
      type="checkbox"
      checked={$value.includes(option.value) ||
        $value.includes(parseInt(option.value))}
      {...attributes}
      class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      id={`${field.name}-${index}`}
    />
  </div>
  <div class="ml-3 text-sm">
    <label for={`${field.name}-${index}`} class="font-medium text-gray-700">
      {option.label}
    </label>
    {#if option.meta && option.meta.hint}
      <p class="text-gray-500">
        {option.meta.hint}
      </p>
    {/if}
  </div>
</div>
