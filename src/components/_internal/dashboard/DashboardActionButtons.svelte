<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let buttons = [];

    const onClick = (e, action) => dispatch("click", action);
</script>

<div class="flex flex-col sm:flex-row xl:flex-col">
    {#each buttons as button, i}
        {#if button.buttonConfig.type === 'primary'}
            <button
                on:click={(e) => onClick(e, button.action)}
                type="button"
                class="inline-flex items-center justify-center px-4 py-2 {i > 0 ? 'mt-3 xl:mt-3' : null} text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-full">
                {button.buttonConfig.label}
            </button>
        {:else if button.buttonConfig.type === 'accent'}
            <button
                on:click={(e) => onClick(e, button.action)}
                type="button"
                class="inline-flex items-center justify-center px-4 py-2 {i > 0 ? 'mt-3 xl:mt-3' : null} text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 xl:ml-0 xl:w-full">
                {button.buttonConfig.label}
            </button>
        {:else if button.buttonConfig.type === 'warn'}
            <button
                on:click={(e) => onClick(e, button.action)}
                type="button"
                class="inline-flex items-center justify-center px-4 py-2 {i > 0 ? 'mt-3 xl:mt-3' : null} text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 xl:ml-0 xl:w-full">
                {button.buttonConfig.label}
            </button>
        {:else if button.buttonConfig.type === 'danger'}
            <button
                on:click={(e) => onClick(e, button.action)}
                type="button"
                class="inline-flex items-center justify-center px-4 py-2 {i > 0 ? 'mt-3 xl:mt-3' : null} text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 xl:ml-0 xl:w-full">
                {button.buttonConfig.label}
            </button>
        {/if}
    {/each}
</div>
