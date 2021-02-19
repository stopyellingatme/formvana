<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    const handleInput = (e) => {
        $valueStore = e.target.checked;
        dispatch("input", $valueStore);
    };

    // Svelidation specific elements
    export let useInput = null;
    export let valueStore = null;
    export let errorsStore = null;

    export let label;
    export let name;
    export let id = name;
    export let checked = false;
    export let classname =
        "w-4 h-4 text-indigo-600 transition duration-150 ease-in-out form-checkbox";
</script>

<input
    {id}
    {name}
    type="checkbox"
    {checked}
    class={classname}
    use:useInput
    bind:value={$valueStore}
    on:change={handleInput} />
<label for={name} class="block ml-2 text-sm leading-5 text-gray-900">
    {label}
</label>
