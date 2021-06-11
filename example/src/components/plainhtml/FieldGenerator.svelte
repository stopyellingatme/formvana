<!-- 
	This component will take form.fields, loop over the fields 
	to display and group them together into field sets or 
	field groups as needed.
 -->
<script>
  import { onMount, tick } from "svelte";
  import Field from "./Field.svelte";
  import FieldSet from "./Fieldset.svelte";

  export let fields;
  let field_groups = {};

  $: sorted_fields = handleFieldGroups(fields);

  onMount(() => {
    tick();
  });

  /**
   * Alright, we got it working.
   * Now we need to clean this mess up.
   */
  const handleFieldGroups = (__fields) => {
    if (__fields && __fields.length > 0) {
      for (let i = 0; __fields.length > i; ++i) {
        const field = __fields[i];
        if (field.group) {
          if (Array.isArray(field_groups[field.group])) {
            field_groups[field.group].push(field);
          } else {
            field_groups[field.group] = [field];
          }
        } else {
          field_groups[`field_${i}`] = field;
        }
      }
      const _fields = getSortedFields();
      return _fields;
    } else {
      return __fields;
    }
  };

  const getSortedFields = () => {
    const new_fields = [];
    Object.keys(field_groups).forEach((key) => {
      new_fields.push(field_groups[key]);
    });

    return new_fields;
  };
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
