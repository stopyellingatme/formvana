<script lang="ts">
  import Errors from "./Errors.svelte";

  export let errorsStore = null;
  export let valueStore = null;
  export let useInput = null;

  export let name;
  export let label;
  export let attrs = {};

  // Gotta figure out what to do about styling!
  // Gotta figure out what to do about styling!
  // Gotta figure out what to do about styling!
  // Gotta figure out what to do about styling!
  // Gotta figure out what to do about styling!

  $: errors = $errorsStore && $errorsStore.constraints;

  $: attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false,
    },
    attrs
  );
</script>

<div>
  <label for={name}>
    {label}
  </label>
  <div>
    <input {name} {...attributes} bind:value={$valueStore} use:useInput />
  </div>
  {#if errors}
    <Errors {errors} />
  {/if}
</div>
