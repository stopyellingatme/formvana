<script lang="ts">
  import Input from "./Input.svelte";
  import Textarea from "./Textarea.svelte";
  import Select from "./Select.svelte";
  import CheckboxGroup from "./Checkbox/CheckboxGroup.svelte";
  import RadioGroup from "./Radio/RadioGroup.svelte";

  export let field;

  $: visible = !field.hidden;
</script>

<!-- If the field is not hidden, then display it. -->
{#if visible}
  <div>
    <!-- Check which input type we're displaying the field as! -->
    {#if field.selector === "input"}
      <Input {field} />
    {:else if field.selector === "select" || field.selector === "dropdown"}
      <Select {field} />
    {:else if field.selector === "textarea"}
      <Textarea {field} />
    {:else if field.selector === "checkbox" || field.selector === "checkboxes"}
      <CheckboxGroup {field} />
    {:else if field.selector === "radio" || field.selector === "radios"}
      <RadioGroup {field} />
    {/if}
  </div>
{/if}

<style>
  div {
    /* display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem; */
    /* flex-wrap: row wrap; */
    padding: 5px;
  }
</style>