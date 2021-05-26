<script>
  import InputErrors from "./InputErrors.svelte";

  export let field;
  export let options;
  export let useInput = null;
  $: errorsStore = field.errors;
  $: valueStore = field.value;

  let name = field.name;
  let label = field.label;
  let attrs = field.attributes || {};

  let default_class =
    "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  let error_class =
    "bg-white relative w-full text-red-900 border border-red-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";

  $: input_attributes = Object.assign({}, attrs);
  $: errors = $errorsStore && $errorsStore.constraints;
  $: cls =
    $errorsStore && $errorsStore.constraints ? error_class : default_class;

  const handleChange = (e) => {
    field.value.set(Number.parseInt(e.target.value));
  };
</script>

<div>
  <div>
    <label for={name} class="block text-sm font-medium leading-5 text-gray-700">
      {label}
    </label>
    <div class="relative m-1 rounded-md shadow-sm">
      <select
        {name}
        {...input_attributes}
        class={cls}
        use:useInput
        on:input={(e) => handleChange(e)}
      >
        {#if $valueStore === undefined || null}
          <option selected value={undefined}> -- </option>
        {/if}
        {#each options as option}
          {#if $valueStore === option.value}
            <option selected value={option.value}>{option.label}</option>
          {:else}
            <option value={option.value}>{option.label}</option>
          {/if}
        {/each}
      </select>
    </div>

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
