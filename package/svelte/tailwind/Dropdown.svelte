<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";
  import DropdownOption from "./DropdownOption.svelte";
  import InputErrors from "./InputErrors.svelte";

  let is_focused = false;
  let menu_open = false;
  const toggle = () => (menu_open = !menu_open);

  export let useInput;
  export let valueStore; // Used as active_index
  export let errorsStore;

  export let options;
  export let label;
  export let name;
  export let attrs = {};

  let default_class =
    "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  let error_class =
    "bg-white relative w-full text-red-900 border border-red-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";

  $: input_attributes = Object.assign({}, attrs);
  $: errors = $errorsStore && $errorsStore.constraints;
  $: cls =
    $errorsStore && $errorsStore.constraints ? error_class : default_class;

  onMount(() => {});

  function handleKeyDown(e) {
    if (!is_focused) return;
    switch (e.key) {
      case "ArrowDown":
        menu_open = true;
        e.preventDefault();
        if (options[$valueStore + 1] && options[$valueStore + 1].value) {
          $valueStore = $valueStore + 1;
          node.dispatchEvent(new Event("change"));
        }
        break;
      case "ArrowUp":
        menu_open = true;
        e.preventDefault();
        if (
          options[$valueStore - 1] &&
          (options[$valueStore - 1].value ||
            options[$valueStore - 1].value === 0)
        ) {
          $valueStore = $valueStore - 1;
          node.dispatchEvent(new Event("change"));
        }
        break;
      case "Escape":
        e.preventDefault();
        if (is_focused) menu_open = false;
        break;
    }
  }

  $: selectedLabel =
    options && options[$valueStore] && options[$valueStore].label;

  /**
   * Capture the element with useInput.
   * We need it for dispatching the attached validation (or clear) events
   */
  let node;

  const handleChange = (e, val) => {
    $valueStore = val;
    node.dispatchEvent(new Event("change"));
    menu_open = false;
  };
  const handleFocus = (e) => {
    is_focused = true;
    // dispatch("focus", $valueStore);
  };
  const handleBlur = (e) => {
    is_focused = false;
    // dispatch("blur", $valueStore);
    menu_open = false;
  };
</script>

<svelte:window on:keydown={handleKeyDown} />

<div>
  <label for={name} class="block text-sm font-medium leading-5 text-gray-700">
    {label}
  </label>
  <div class="relative mt-1 rounded-md shadow-sm">
    <button
      bind:this={node}
      {name}
      {...input_attributes}
      on:click={toggle}
      on:focus={handleFocus}
      on:blur={handleBlur}
      value={selectedLabel}
      type="button"
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-labelledby="listbox-label"
      class={cls}
      use:useInput
    >
      <span class="block truncate">
        {selectedLabel ? selectedLabel : "Select"}
      </span>
      <span
        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
      >
        <!-- Heroicon name: selector -->
        <svg
          class="w-5 h-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>
    {#if menu_open}
      <div
        in:fly={{ duration: 75, y: -40 }}
        out:fade={{ duration: 75 }}
        class="absolute z-40 w-full mt-1 bg-white rounded-md shadow-lg"
      >
        <ul
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-item-3"
          class="py-1 overflow-auto text-base rounded-md max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          {#each options as { label, value }, i}
            <DropdownOption
              on:click={(e) => handleChange(e, value)}
              id="listbox-option-{i}"
              {label}
              {value}
              selected={selectedLabel === label}
            />
          {/each}
        </ul>
      </div>
    {/if}
    {#if errors}
      <!-- This is the red X in the input box -->
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <svg
          class="w-5 h-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012
              0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    {/if}
  </div>
  {#if errors}
    <InputErrors errorsStore={errors} />
  {/if}
</div>
