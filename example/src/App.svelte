<script lang="ts">
  import "tailwindcss/dist/tailwind.css";
  import "tailwindcss/dist/components.css";
  import ExampleForm from "./forms/example/ExampleForm.svelte";
</script>

<main
  class="py-24 pb-10 mx-auto max-w-7xl lg:py-36 xl:py-36 2xl:py-36 md:py-24 lg:px-8"
>
  <div class="flex items-start justify-center">
    <div class="w-full space-y-6">
      <section>
        <ExampleForm />
      </section>
    </div>
  </div>
</main>
