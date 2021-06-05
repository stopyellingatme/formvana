<script lang="ts">
  import InputErrors from "./InputErrors.svelte";

  export let field;

  let name = field.name;

  $: value = field.value;
  $: errorsStore = field.errors;
  $: errors = $errorsStore && $errorsStore.errors;
  $: input_attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: true,
    },
    { rows: 3 },
    field.attributes || {}
  );

  $: classes = `block w-full px-3 py-2 border appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none sm:text-sm sm:leading-5 disabled:cursor-not-allowed ${
    errors
      ? "placeholder-red-300 border-red-300 focus:ring-red-500 focus:border-red-300"
      : "placeholder-gray-300 border-gray-300 focus:shadow-outline-blue focus:border-blue-300"
  }`;
</script>

<div class="sm:col-span-6">
  <label for={name} class="block text-sm font-medium text-gray-700">
    {field.label}
  </label>
  <div class="mt-1">
    <textarea
      {name}
      {...input_attributes}
      class={classes}
      bind:value={$value}
    />
    {#if field.hint}
      <p class="mt-2 text-sm text-gray-500">
        {field.hint}
      </p>
    {/if}
  </div>
  {#if errors}
    <InputErrors errorsStore={errors} />
  {/if}
</div>
