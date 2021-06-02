<script>
  import InputErrors from "./InputErrors.svelte";

  export let field;
  export let options;
  export let useInput;

  let name = field.name;

  const default_class =
    "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const error_class =
    "bg-white relative w-full text-red-900 border border-red-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";

  $: valueStore = field.value;
  $: errorsStore = field.errors;
  $: attributes = Object.assign({}, field.attributes || {});
  $: errors = $errorsStore && $errorsStore.errors;
  $: cls = errors ? error_class : default_class;
</script>

<div>
  <div>
    <label for={name} class="block text-sm font-medium leading-5 text-gray-700">
      {field.label}
    </label>
    <div class="relative m-1 rounded-md shadow-sm">
      <select {name} {...attributes} class={cls} use:useInput>
        {#if $valueStore === undefined || null}
          <option selected value={undefined}> -- </option>
        {/if}
        {#each options as option}
          <option selected={$valueStore === option.value} value={option.value}
            >{option.label}</option
          >
        {/each}
      </select>
    </div>
  </div>
  {#if errors}
    <InputErrors errorsStore={errors} />
  {/if}
</div>
