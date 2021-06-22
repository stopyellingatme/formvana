<script>
  import Field from "./Field.svelte";
  import FieldSet from "./Fieldset.svelte";

  export let form;

  /** This is how we sort the fields into groups! */
  $: sorted_fields = form.getFieldGroups();
</script>

<!-- Loop over the fields here! -->
{#each sorted_fields as field}
  <!-- If the "field" is an array, it'll be an array of fields -->
  {#if Array.isArray(field)}
    <FieldSet fields={field} />
  {:else}
    <Field {field} />
  {/if}
{/each}
