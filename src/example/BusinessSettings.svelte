<script lang="ts">
  import { onMount } from "svelte";
  import BusinessSettingsForm from "./BusinessSettingsForm.svelte";

  onMount(() => {});
</script>

<main
  class="py-24 pb-10 mx-auto max-w-7xl lg:py-36 xl:py-36 2xl:py-36 md:py-24 lg:px-8"
>
  <div class="flex items-start justify-center">
    <div class="w-full space-y-6">
      <section aria-labelledby="test_business_settings_form">
        <BusinessSettingsForm />
      </section>
    </div>
  </div>
</main>
