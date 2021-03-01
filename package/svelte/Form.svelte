<script>
  import { onDestroy, onMount } from "svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import { createEventDispatcher } from "svelte";
  import Field from "./svelte/inputs/Field.svelte";
  const dispatch = createEventDispatcher();

  //* Form State
  export let form;

  const handleSubmit = (e) => {
    dispatch("submit", e);
  };

  onMount(() => {
    // setTimeout(() => {
    // $form.fields.forEach((field) => {
    //   console.log("VAL: ", get(field.value));
    // });
    // }, 5000);
  });

  onDestroy(() => {
    dispatch("destroy", true);
    form.destroy();
  });

  /**
   * Well, it looks like we're gonna have to 
   * make this thing handle the FormGroup and
   * FormStepper stuff.
   * 
   * $: fields are_of_type {
   *      type: "default | group | stepper",
   *      item: FieldConfig | FieldGroup | FieldStepper
   *    }
   */

  let fw;
  let fh;
</script>

<form
  on:submit|preventDefault={handleSubmit}
  bind:clientHeight={fh}
  bind:clientWidth={fw}
>
  <div class={$form.form_classes[0]}>
    <LoadingIndicator visible={$form.loading} w={fw} h={fh} />
    <div class={$form.form_classes[1]}>
      <!-- Header Area -->
      <slot name="header" />

      <!-- Form Wrapper Div (col num, col gaps, etc.) -->
      <div class={$form.form_classes[2]}>
        {#each $form.fields as field, i}
          <Field {field} {form} />
        {/each}
      </div>
    </div>
    <!-- Button Area -->
    <slot name="buttons" />
  </div>
</form>
