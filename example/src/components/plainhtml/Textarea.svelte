<script lang="ts">
  export let field;
  let name = field.name;
  let errorsStore, errors;

  $: value = field.value;
  $: {
    errorsStore = field.errors;
    errors = $errorsStore && $errorsStore.errors;
  }

  $: input_attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: true,
    },
    { rows: 3 },
    field.attributes || {}
  );
</script>

<div>
  <label for={name}>
    {field.label}
  </label>
  <div>
    <textarea {name} {...input_attributes} bind:value={$value} />
    {#if field.hint}
      <p>
        {field.hint}
      </p>
    {/if}
  </div>
  <div data-error-for={field.name} />
</div>

<style>
  textarea {
    border: 1px gray solid;
    padding: 2px;
    border-radius: 4%;
    border-style: inset;
  }
</style>
