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

<fieldset
  class="col-span-4 p-4 space-y-2 border border-gray-300 border-solid sm:col-span-2"
>
  {#if legend}
    <legend>{@html legend}</legend>
  {/if}
  {#each fields as field}
    <Field {field} />
  {/each}
</fieldset>
