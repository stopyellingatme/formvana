<script lang="ts">
  export let errorsStore = null;
  $: errors = Object.entries(errorsStore).map(([key, val]) => {
    return {
      key,
      val,
    };
  });

  // $: console.log("ERRORS FROM COMPONENT: ", errorsStore, errors);
</script>

{#if errorsStore}
  {#each errors as error, i}
    <p class="mt-2 text-sm text-red-600">{error.val}</p>
  {/each}
{/if}
