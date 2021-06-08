<script lang="ts">
  import "tailwindcss/dist/tailwind.css";
  import "tailwindcss/dist/components.css";
  import ExampleForm from "./forms/class-validator/basic/ExampleForm.svelte";
  import FormGroup from "./forms/class-validator/group/FormGroup.svelte";
  import SuperstructForm from "./forms/superstruct/basic/SuperstructForm.svelte";
  import StepperForm from "./forms/class-validator/stepper/StepperForm.svelte";

  const validators = ["class-validator", "superstruct"];
  const examples = ["basic", "group", "stepper"];

  $: selected_validator = validators[0];
  $: selected = examples[1];
</script>

<main>
  <!-- 
    Selector section for the validator libraries supported via 
    the examples.
   -->
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

  <!-- 
    Selector for the type of form example.
   -->
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

  <!-- 
    This is the beautiful nested if statement used to display the different
    form generator/validation examples
   -->

  {#if selected_validator === "class-validator"}
    {#if selected === examples[0]}
      <ExampleForm />
    {:else if selected === examples[1]}
      <FormGroup />
    {:else if selected === examples[2]}
      <div class="flex items-center justify-center w-full">
        <!-- <p class="m-10 font-mono text-lg capitalize">Stepper Goes Here</p> -->
        <StepperForm />
      </div>
    {/if}
  {:else if selected_validator === "superstruct"}
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
