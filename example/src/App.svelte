<script lang="ts">
  import "tailwindcss/dist/tailwind.css";
  import "tailwindcss/dist/components.css";
  import ExampleForm from "./forms/basic/ExampleForm.svelte";
  import FormGroup from "./forms/group/FormGroup.svelte";

  const examples = ["basic", "group", "stepper"];
  $: selected = examples[0];
</script>

<main>
  <!-- This is the example selector header -->
  <div class="flex items-center justify-center w-full">
    {#each examples as ex}
      <span
        class="m-10 font-mono text-lg capitalize cursor-pointer"
        on:click={() => {
          selected = ex;
        }}>{ex}</span
      >
    {/each}
  </div>
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
</main>
