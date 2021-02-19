<script lang="ts">
    import DropdownErrors from "./DropdownErrors.svelte";
    // Svelidation specific elements
    export let useInput = null;
    export let valueStore = null;
    export let errorsStore = null;

    // {name, id, title, subTitle, value}
    export let options = [];
    export let srText = "";

    const setVal = (val) => {
        $valueStore = val;
    };
</script>

<fieldset>
    <legend class="sr-only">{srText}</legend>

    <div class="-space-y-px bg-white rounded-md">
        {#each options as option, i}
            {#if option.value === $valueStore}
                <!-- On: "bg-indigo-50 border-indigo-200 z-10", Off: "border-gray-200" -->
                <div
                    on:click={() => setVal(option.value)}
                    class="relative z-10 flex p-4 border border-indigo-200 cursor-pointer rounded-tl-md rounded-tr-md bg-indigo-50">
                    <div class="flex items-center h-5">
                        <input
                            id={option.id}
                            name={option.name}
                            type="radio"
                            use:useInput
                            bind:group={$valueStore}
                            value={option.value}
                            class="w-4 h-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-indigo-500"
                            checked />
                    </div>
                    <label
                        for={option.id}
                        class="flex flex-col ml-3 cursor-pointer">
                        <!-- On: "text-indigo-900", Off: "text-gray-900" -->
                        <span class="block text-sm font-medium text-indigo-900">
                            {option.title}
                        </span>
                        <!-- On: "text-indigo-700", Off: "text-gray-500" -->
                        <span class="block text-sm text-indigo-700">
                            {option.subTitle}
                        </span>
                    </label>
                </div>
            {:else}
                <div
                    on:click={() => setVal(option.value)}
                    class="relative flex p-4 border border-gray-200 cursor-pointer rounded-bl-md rounded-br-md">
                    <div class="flex items-center h-5">
                        <input
                            id={option.id}
                            name={option.name}
                            type="radio"
                            use:useInput
                            bind:group={$valueStore}
                            value={option.value}
                            class="w-4 h-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-indigo-500" />
                    </div>
                    <label
                        for={option.id}
                        class="flex flex-col ml-3 cursor-pointer">
                        <!-- On: "text-indigo-900", Off: "text-gray-900" -->
                        <span class="block text-sm font-medium">
                            {option.title}
                        </span>
                        <!-- On: "text-indigo-700", Off: "text-gray-500" -->
                        <span class="block text-sm"> {option.subTitle} </span>
                    </label>
                </div>
            {/if}
        {/each}
        <DropdownErrors {errorsStore} />
    </div>
</fieldset>
