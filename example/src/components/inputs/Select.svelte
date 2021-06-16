<script>
  import InputErrors from "./InputErrors.svelte";

  export let field;
  let options = field.options;
  let name = field.name;
  let errorStore, errors;

  /**
   * If we want the ability to programatically update the value then
   * we have to bind the field.value to the input.
   */
  $: value = field.value;

  $: {
    errorStore = field.errors;
    errors = $errorStore && $errorStore.errors;
  }

  $: attributes = Object.assign({}, field.attributes || {});

  $: classes = `bg-white relative w-full border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 sm:text-sm ${
    errors
      ? "text-red-900 border-red-300 focus:ring-red-500 focus:border-red-300"
      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-300"
  }`;
</script>

<div>
  <div>
    <label for={name} class="block text-sm font-medium leading-5 text-gray-700">
      {field.label}
    </label>
    <div class="relative m-1 rounded-md shadow-sm">
      <select {name} {...attributes} class={classes}>
        {#if !$value}
          <option selected value={undefined}> -- </option>
        {/if}
        {#each options as option}
          <option selected={$value === option.value} value={option.value}
            >{option.label}</option
          >
        {/each}
      </select>
    </div>
  </div>
  <div data-error-for={field.name} />
</div>
