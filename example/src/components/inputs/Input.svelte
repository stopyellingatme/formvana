<script>
  import InputErrors from "./InputErrors.svelte";

  export let field;

  let name = field.name;

  /**
   * If we want the ability to programatically/automatically update the value then
   * we have to bind field.value to the input.
   */
  $: value = field.value;

  $: errorsStore = field.errors;
  $: errors = $errorsStore && $errorsStore.errors;

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

<div>
  <label for={name} class="block text-sm font-medium leading-5 text-gray-700">
    {field.label}
  </label>
  <div class="relative mt-1 rounded-md shadow-sm">
    <input {name} {...attributes} class={classes} bind:value={$value} />
    {#if errors}
      <!-- This is the red X in the input box -->
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012
            0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    {/if}
  </div>
  {#if errors}
    <InputErrors errorsStore={errors} />
  {/if}
</div>
