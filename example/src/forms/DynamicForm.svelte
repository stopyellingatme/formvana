<!-- 
  This component is not necessary.
  It just makes using template components easier.
 -->
<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let form; /** Form State */

  onMount(() => {
    dispatch("mount", true);
  });

  onDestroy(() => {
    dispatch("destroy", true);
    $form.destroy();
  });
</script>

{#if $form.template}
  <!-- 
    Bind the form.template the dynamically rendered svelte:component

    There is a caveat here:
      The Template component can only emit an "event" event.
      We dispatch the event.detail.type in order to pass ANY event to the
      parent form component.
   -->
  <svelte:component
    this={$form.template}
    {form}
    {...$$props}
    on:event={(e) => dispatch(e.type || e.detail.type, e)}
  />
  <!-- 
    ***************************************************** 
    The on:event handler NEEDS either type || detail.type 
    *****************************************************

    This allows us to pass an event from the child template to the parent
    form component.
  -->
{/if}
