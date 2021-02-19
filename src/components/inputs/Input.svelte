<script lang="ts">
  import InputErrors from "./InputErrors.svelte";
  import { _class } from "../../utils/classes.utils";

  export let errorsStore = null;
  export let valueStore = null;
  export let useInput = null;

  export let name;
  export let label;
  export let attrs = {};
  export let classname =
    "block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";

  $: errors = $errorsStore && $errorsStore.constraints;

  $: _inputAttributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false,
    },
    attrs
  );

  $: cls = _class(
    classname,
    "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500",
    errors ? errors.length > 0 : false
  );
</script>

<div>
  <label for={name} class="block text-sm font-medium leading-5 text-gray-700">
    {label}
  </label>
  <div class="relative mt-1 rounded-md shadow-sm">
    <input
      {name}
      {..._inputAttributes}
      class={cls}
      bind:value={$valueStore}
      use:useInput
    />
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
