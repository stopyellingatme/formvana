<script>
  export let field;
  export let option;
  export let index;

  $: value = field.value;

  /** This allows us to update attributes dynamically */
  $: attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false,
    },
    field.attributes || {}
  );

  $: checked = $value == option.value;
</script>

<div>
  <input
    name={field.name}
    bind:value={option.value}
    type="radio"
    {checked}
    {...attributes}
    id={`${field.name}-${index}`}
  />
  <label for={`${field.name}-${index}`}>
    {option.label}
  </label>
</div>
