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

  $: input_attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false,
    },
    attrs
  );

  // $: cls =
  //   $errorsStore && $errorsStore.constraints ? error_class : default_class;
</script>

<div>
  <label for={name}>
    {label}
  </label>
  <div>
    <input {name} {...input_attributes} bind:value={$valueStore} use:useInput />
  </div>
  {#if errors}
    <Errors errorsStore={errors} />
  {/if}
</div>
