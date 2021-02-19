<script lang="ts">
  import { _class } from "../../utils/classes.utils";

  export let value;
  export let errorsStore;
  export let useInput;

  export let label;
  export let hint;
  export let name;
  export let attrs = {};
  export let classname =
    "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md";

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
      id={name}
      {name}
      {..._inputAttributes}
      class={cls}
      bind:value={$value}
      use:useInput
    />
    {#if hint}
      <p class="mt-2 text-sm text-gray-500">
        {hint}
      </p>
    {/if}
  </div>
</div>
