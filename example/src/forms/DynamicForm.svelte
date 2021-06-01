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
   -->
  <svelte:component
    this={$form.template}
    {form}
    {...$$props}
    on:event={(e) => dispatch(e.detail.type, e)}
  />
{:else}
  <!-- 
    Or pass in a custom form as a child - takes {form} prop,

    But it's easier to just pass in a template, honestly
   -->
  <slot {form} {...$$props} />
{/if}
