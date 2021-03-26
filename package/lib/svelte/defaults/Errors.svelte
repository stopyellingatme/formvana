<script lang="ts">
  export let errorsStore = null;
  $: errors = Object.entries(errorsStore).map(([key, val]) => {
    return {
      key,
      val,
    };
  });
</script>

{#if errorsStore}
  {#each errors as error, i}
    <p>{error.val}</p>
  {/each}
{/if}

<style>
	p {
		color: red;
	}
</style>
