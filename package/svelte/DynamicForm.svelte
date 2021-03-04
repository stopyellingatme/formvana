<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  //* Form State
  export let form;

  onMount(() => {
    dispatch("mount", true);
  });

  onDestroy(() => {
    dispatch("destroy", true);
    $form.destroy();
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
</script>

{#if $form.template}
  <!-- Use a Template -->
  <svelte:component this={$form.template} {form} />
{:else}
  <!-- Or pass in a custom form as a child - takes {form} prop -->
  <!-- But it's easier to just pass in a template, honestly -->
  <slot {form} />
{/if}
