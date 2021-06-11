<script>
  import { onMount } from "svelte";
  import Field from "./Field.svelte";
  export let fields;

  $: legend = null;

  onMount(() => {
    if (fields && fields.length > 0)
      fields.forEach((field) => {
        if (field.attributes.legend) {
          legend = field.attributes.legend;
        }
      });
  });
</script>

<fieldset class="unreset">
  {#if legend}
    <legend>{@html legend}</legend>
  {/if}
  {#each fields as field}
    <Field {field} />
  {/each}
</fieldset>

<style>
  fieldset {
    padding: 10px;
    margin: 10px;
    border: 0.5px lightgray solid;
  }
</style>
