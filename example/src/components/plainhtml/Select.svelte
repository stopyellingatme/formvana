<script>
  export let field;
  let options = field.options;
  let name = field.name;
  let errorStore, errors;

  /**
   * If we want the ability to programatically update the value then
   * we have to bind the field.value to the input.
   */
  $: value = field.value;

  $: {
    errorStore = field.errors;
    errors = $errorStore && $errorStore.errors;
  }

  $: attributes = Object.assign({}, field.attributes || {});
</script>

<div>
  <div>
    <label for={name}>
      {field.label}
    </label>
    <div>
      <select {name} {...attributes}>
        {#if !$value}
          <option selected value={undefined}> -- </option>
        {/if}
        {#each options as option}
          <option selected={$value === option.value} value={option.value}
            >{option.label}</option
          >
        {/each}
      </select>
    </div>
  </div>
</div>

<style>
  select {
    border: 1px gray solid;
    padding: 2px;
    border-radius: 4%;
    border-style: inset;
  }
</style>