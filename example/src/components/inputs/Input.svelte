<script>
  export let field;
  let name = field.name;
  let errorsStore, errors;

  /**
   * If we want the ability to programatically/automatically update the value then
   * we have to bind field.value to the input.
   */
  $: value = field.value;

  $: {
    errorsStore = field.errors;
    errors = $errorsStore && $errorsStore.errors;
  }

  /** This allows us to update attributes dynamically */
  $: attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false,
    },
    field.attributes || {}
  );

  /** Tailwind input classes. Changed base on errors */
  $: classes = `block w-full px-3 py-2 border appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none sm:text-sm sm:leading-5 disabled:cursor-not-allowed ${
    errors
      ? "placeholder-red-300 border-red-300 focus:ring-red-500 focus:border-red-300"
      : "placeholder-gray-300 border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
  }`;
</script>

<div data-error-wrapper>
  <label for={name} class="block text-sm font-medium leading-5 text-gray-700">
    {field.label}
  </label>
  <div class="relative mt-1 rounded-md shadow-sm">
    <input {name} {...attributes} class={classes} bind:value={$value} />
  </div>
  <div data-error-for={field.name} />
</div>
