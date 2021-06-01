<script lang="ts">
  import "tailwindcss/dist/tailwind.css";
  import "tailwindcss/dist/components.css";
  import ExampleForm from "./forms/class-validator/basic/ExampleForm.svelte";
  import FormGroup from "./forms/class-validator/group/FormGroup.svelte";
  import SuperstructForm from "./forms/superstruct/basic/SuperstructForm.svelte";

  const validators = ["class-validator", "superstruct"];
  const examples = ["basic", "group", "stepper"];

  $: selected_validator = validators[1];
  $: selected = examples[0];
</script>

<main>
  <div class="flex items-center justify-center w-full">
    {#each validators as ex}
      <span
        class="m-10 font-mono text-lg capitalize cursor-pointer"
        class:underline={selected_validator === ex}
        on:click={() => {
          selected_validator = ex;
        }}>{ex}</span
      >
    {/each}
  </div>
  <!-- This is the example selector header -->
  <div class="flex items-center justify-center w-full">
    {#each examples as ex}
      <span
        class="m-10 font-mono text-lg capitalize cursor-pointer"
        class:underline={selected === ex}
        on:click={() => {
          selected = ex;
        }}>{ex}</span
      >
    {/each}
  </div>
  {#if selected_validator === "class-validator"}
    <!-- These are the form examples! -->
    {#if selected === examples[0]}
      <ExampleForm />
    {:else if selected === examples[1]}
      <!-- <div class="flex items-center justify-center w-full">
      <p class="m-10 font-mono text-lg capitalize">Group Goes Here</p>
    </div> -->
      <FormGroup />
    {:else if selected === examples[2]}
      <div class="flex items-center justify-center w-full">
        <p class="m-10 font-mono text-lg capitalize">Stepper Goes Here</p>
      </div>
    {/if}
  {:else if selected_validator === "superstruct"}
    <!-- These are the form examples! -->
    {#if selected === examples[0]}
      <SuperstructForm />
    {:else if selected === examples[1]}
      <div class="flex items-center justify-center w-full">
        <p class="m-10 font-mono text-lg capitalize">Stepper Goes Here</p>
      </div>
    {:else if selected === examples[2]}
      <div class="flex items-center justify-center w-full">
        <p class="m-10 font-mono text-lg capitalize">Stepper Goes Here</p>
      </div>
    {/if}
  {/if}
</main>
