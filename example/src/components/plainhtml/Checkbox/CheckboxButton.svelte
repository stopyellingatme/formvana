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

  $: checked =
    $value.includes(option.value) || $value.includes(parseInt(option.value));
</script>

<div>
  <div>
    <input
      name={field.name}
      bind:value={option.value}
      type="checkbox"
      {checked}
      {...attributes}
      id={`${field.name}-${index}`}
    />
  </div>
  <div>
    <label for={`${field.name}-${index}`}>
      {option.label}
    </label>
    {#if option.meta && option.meta.hint}
      <p>
        {option.meta.hint}
      </p>
    {/if}
  </div>
</div>
