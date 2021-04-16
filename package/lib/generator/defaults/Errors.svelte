<script lang="ts">
  export let errors = null;
  $: errs = Object.entries(errors).map(([key, val]) => {
    return {
      key,
      val,
    };
  });
</script>

{#if errors}
  {#each errs as error, i}
    <p>{error.val}</p>
  {/each}
{/if}

<style>
	p {
		color: red;
	}
</style>
