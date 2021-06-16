<script>
  import RadioButton from "./RadioButton.svelte";

  export let field;
  let options = field.options;
</script>

<div class="pt-6 sm:pt-5">
  <div role="group" aria-labelledby={`${field.name}-radio`}>
    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
      <div>
        <div
          class="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
          id={`${field.name}-radio`}
        >
          {field.label}
        </div>
        <div
          class="text-base text-gray-900 font-small sm:text-sm sm:text-gray-700"
        >
          {field.hint}
        </div>
        <div data-error-for={field.name} />
      </div>
      <div class="sm:col-span-2">
        <div class="max-w-lg">
          <div class="mt-4 space-y-4">
            {#each options as option, index}
              <RadioButton {option} {index} {field} />
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
