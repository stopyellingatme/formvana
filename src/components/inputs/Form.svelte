<script>
  import { onDestroy, onMount } from "svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import { createEventDispatcher } from "svelte";
  import Input from "./Input.svelte";
  import { get } from "svelte/store";
  const dispatch = createEventDispatcher();

  export let form; // Form State

  const handleSubmit = (e) => {
    console.log(e);
    dispatch("submit", e);
  };

  onMount(() => {
    // setTimeout(() => {
    //   $form.fields.forEach((field) => {
    //     console.log("VAL: ", get(field.value));
    //   });
    // }, 10000);
  });

  onDestroy(() => {
    dispatch("destroy", true);
  });

  let fw;
  let fh;
</script>

<form
  on:submit|preventDefault={handleSubmit}
  bind:clientHeight={fh}
  bind:clientWidth={fw}
>
  <div class="shadow sm:rounded-md">
    <LoadingIndicator visible={$form.loading} w={fw} h={fh} />
    <div class="px-4 py-6 bg-white sm:p-6">
      <!-- Header Area -->
      <slot name="header" />

      <!-- Form Wrapper Div (col num, col gaps, etc.) -->
      <div class={$form.template_classes}>
        {#each $form.fields as field, i}
          <div class={field.className}>
            {#if field.el === "input"}
              <Input
                name={field.name}
                label={field.label}
                attrs={field.attributes}
                valueStore={field.value}
                errorsStore={field.errors}
                useInput={$form.useField}
              />
            {:else}
              <!-- else content here -->
            {/if}
          </div>
        {/each}
      </div>
    </div>
    <!-- Button Area -->
    <slot name="buttons" />
  </div>
</form>
