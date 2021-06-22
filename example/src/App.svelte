<script lang="ts">
  import "tailwindcss/dist/tailwind.css";
  import "tailwindcss/dist/components.css";
  import ExampleForm from "./forms/class-validator/basic/Example.form.svelte";
  import FormGroup from "./forms/class-validator/group/Group.form.svelte";
  import SuperstructForm from "./forms/superstruct/basic/Superstruct.form.svelte";
  import StepperForm from "./forms/class-validator/stepper/Stepper.form.svelte";
  import NoStyleForm from "./forms/class-validator/nostyle/NoStyle.form.svelte";
  import UserForm from "./forms/class-validator/user/User.form.svelte";
  import SimpleExample from "./Simple.example.svelte";
  import GroupSSFrom from "./forms/superstruct/group/Group.ss.form.svelte";

  const validators = ["class-validator", "superstruct"];
  let examples = ["basic", "group", "stepper", "no style", "user"];

  $: selected_validator = validators[0];
  $: selected = examples[0];

  const filterExamples = () => {
    switch (selected_validator) {
      case "class-validator":
        examples = [
          "simple",
          "group",
          "stepper",
          "no style",
          "user",
          "huge form",
        ];
        return;
      case "superstruct":
        examples = ["basic", "group", "stepper", "huge form"];
        return;
      default:
        return;
    }
  };
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
          filterExamples();
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
      <!-- <ExampleForm /> -->
      <SimpleExample />
    {:else if selected === examples[1]}
      <FormGroup />
    {:else if selected === examples[2]}
      <StepperForm />
    {:else if selected === examples[3]}
      <NoStyleForm />
    {:else if selected === examples[4]}
      <UserForm />
    {/if}
  {:else if selected_validator === "superstruct"}
    {#if selected === examples[0]}
      <SuperstructForm />
    {:else if selected === examples[1]}
      <!-- <div class="flex items-center justify-center w-full">
        <p class="m-10 font-mono text-lg capitalize">Stepper Goes Here</p>
      </div> -->
      <GroupSSFrom />
    {:else if selected === examples[2]}
      <div class="flex items-center justify-center w-full">
        <p class="m-10 font-mono text-lg capitalize">Stepper Goes Here</p>
      </div>
    {/if}
  {/if}
</main>
