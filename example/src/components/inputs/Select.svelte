<script>
  import InputErrors from "./InputErrors.svelte";

  export let field;
  export let options;
  export let useInput = null;

  let name = field.name;
  let label = field.label;
  let attrs = field.attributes || {};

  let default_class =
    "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  let error_class =
    "bg-white relative w-full text-red-900 border border-red-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";

  $: valueStore = field.value;
  $: errorsStore = field.errors;
  $: input_attributes = Object.assign({}, attrs);
  $: errors = $errorsStore && $errorsStore.constraints;
  $: cls =
    $errorsStore && $errorsStore.constraints ? error_class : default_class;

  const handleChange = (e) => {
    /** Get option value from options array */
    const opt = options.filter((o) => o.value == e.target.value)[0];
    field.value.set(opt.value);
  };
</script>

<div>
  <div>
    <label for={name} class="block text-sm font-medium leading-5 text-gray-700">
      {label}
    </label>
    <div class="relative m-1 rounded-md shadow-sm">
      <!-- on:input={(e) => handleChange(e)} -->
      <!-- bind:value={$valueStore} -->
      <!-- svelte-ignore a11y-no-onchange -->
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
  </div>
  {#if errors}
    <InputErrors errorsStore={errors} />
  {/if}
</div>
