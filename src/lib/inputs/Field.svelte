<script lang="ts">
  import Input from "./Input.svelte";
  import Dropdown from "./Dropdown.svelte";
  import Textarea from "./Textarea.svelte";

  export let field;
  export let form;
</script>

<div class={field.classname}>
  {#if field.el === "input"}
    <Input
      name={field.name}
      label={field.label}
      attrs={field.attributes}
      valueStore={field.value}
      errorsStore={field.errors}
      useInput={$form.useField}
    />
  {:else if field.el === "select" || field.el === "dropdown"}
    <Dropdown
      name={field.name}
      label={field.label}
      attrs={field.attributes}
      options={field.options}
      valueStore={field.value}
      errorsStore={field.errors}
      useInput={$form.useField}
    />
  {:else if field.el === "textarea"}
    <!-- More fields go here! -->
    <Textarea
      name={field.name}
      label={field.label}
      hint={field.hint}
      attrs={field.attributes}
      valueStore={field.value}
      errorsStore={field.errors}
      useInput={$form.useField}
    />
  {/if}
</div>
