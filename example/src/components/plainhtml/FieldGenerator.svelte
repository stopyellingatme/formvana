<!-- 
	This component will take form.fields, loop over the fields 
	to display and group them together into field sets or 
	field groups as needed.
 -->
<script>
  import { onMount, tick } from "svelte";
  import Field from "./Field.svelte";
  import FieldSet from "./Fieldset.svelte";

  export let form;

  $: sorted_fields = form.getFieldGroups();

  onMount(() => {
    tick();
  });
</script>

<div>
  <!-- Loop over the fields here! -->
  {#each sorted_fields as field, i}
    {#if Array.isArray(field)}
      <FieldSet fields={field} />
    {:else}
      <Field {field} />
    {/if}
  {/each}
</div>

<style>
  div {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem;
    background-color: rgb(249, 250, 251);
    padding: 20px;
    width: 100%;
  }
</style>
