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
      <Input {field} />
    {:else if field.selector === "select" || field.selector === "dropdown"}
      <!-- <Dropdown {field} options={field.options} /> -->
      <Select {field} options={field.options} />
    {:else if field.selector === "textarea"}
      <!-- More fields go here! -->
      <Textarea {field} />
    {/if}
  </div>
{/if}
