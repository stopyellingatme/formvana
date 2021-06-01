<script lang="ts">
  import Input from "./Input.svelte";
  // import Dropdown from "./Dropdown.svelte";
  import Textarea from "./Textarea.svelte";
  import Select from "./Select.svelte";

  export let field;
  export let form;

  $: hidden = field.hidden;
</script>

{#if !hidden}
  <div class={field.classes}>
    {#if field.selector === "input"}
      <Input {field} useInput={$form.useField} />
    {:else if field.selector === "select" || field.selector === "dropdown"}
      <!-- <Dropdown {field} options={field.options} useInput={$form.useField} /> -->
      <Select {field} options={field.options} useInput={$form.useField} />
    {:else if field.selector === "textarea"}
      <!-- More fields go here! -->
      <Textarea {field} useInput={$form.useField} />
    {/if}
  </div>
{/if}
