<script lang="ts">
    export let errorsStore = null;
</script>

{#if $errorsStore.includes('type')}
    <p class="mt-2 text-sm text-red-600">Please select a valid item.</p>
{/if}
{#if $errorsStore.includes('required')}
    <p class="mt-2 text-sm text-red-600">This field is required.</p>
{/if}
