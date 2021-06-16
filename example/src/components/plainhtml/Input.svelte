<script>
  export let field;
  let name = field.name;
  let errorsStore, errors;

  /**
   * If we want the ability to programatically/automatically update the value then
   * we have to bind field.value to the input.
   */
  $: value = field.value;

  $: {
    errorsStore = field.errors;
    errors = $errorsStore && $errorsStore.errors;
  }

  /** This allows us to update attributes dynamically */
  $: attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false,
    },
    field.attributes || {}
  );
</script>

<div>
  <label for={name}>
    {field.label}
  </label>
  <div>
    <input {name} {...attributes} bind:value={$value} />
  </div>
  <div data-error-for={field.name} />
</div>

<style>
  input {
    border: 1px gray solid;
    padding: 2px;
    border-radius: 4%;
    border-style: inset;
  }
</style>