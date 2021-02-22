<script lang="ts">
  import { _class } from "../../utils/classes.utils";
	import InputErrors from "./InputErrors.svelte";

  export let valueStore;
  export let errorsStore;
  export let useInput;

  export let label;
  export let hint;
  export let name;
  export let attrs = {};
  export let classname =
    "block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";

  $: errors = $errorsStore && $errorsStore.constraints;

  $: _inputAttributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: true,
    },
    attrs,
    { rows: 3 } // Default to 3 rows
  );

  $: cls = _class(
    classname,
    "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500",
    errors ? errors.length > 0 : false
  );
</script>

<div class="sm:col-span-6">
  <label for={name} class="block text-sm font-medium text-gray-700">
    {label}
  </label>
  <div class="mt-1">
    <textarea
      {name}
      {..._inputAttributes}
      class={cls}
      bind:value={$valueStore}
      use:useInput
    />
    {#if hint}
      <p class="mt-2 text-sm text-gray-500">
        {hint}
      </p>
    {/if}
  </div>
  {#if errors}
    <InputErrors errorsStore={errors} />
  {/if}
</div>
