<script lang="ts">
  import InputErrors from "./InputErrors.svelte";

  export let field;

  let name = field.name;
  let label = field.label;
  let hint = field.hint;
  let attrs = field.attributes || {};

  let default_class =
    "block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";
  let error_class =
    "block w-full px-3 py-2 placeholder-red-300 border border-red-300 appearance-none transition text-red-900 duration-150 ease-in-out rounded-md focus:outline-none focus:ring-red-500 focus:shadow-outline-red focus:border-red-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";

  $: value = field.value;
  $: errorsStore = field.errors;
  $: errors = $errorsStore && $errorsStore.errors;
  $: cls = $errorsStore && $errorsStore.errors ? error_class : default_class;
  $: input_attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: true,
    },
    attrs,
    { rows: 3 } // Default to 3 rows
  );
</script>

<div class="sm:col-span-6">
  <label for={name} class="block text-sm font-medium text-gray-700">
    {label}
  </label>
  <div class="mt-1">
    <textarea {name} {...input_attributes} class={cls} bind:value={$value} />
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
