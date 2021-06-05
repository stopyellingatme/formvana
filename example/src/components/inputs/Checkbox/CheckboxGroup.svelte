<script>
  import Checkbox from "./Checkbox.svelte";

  export let field;
  let options = field.options;
</script>

<div class="pt-6 sm:pt-5">
  <div role="group" aria-labelledby={`${field.name}-checkbox`}>
    <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
      <div>
        <div
          class="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
          id={`${field.name}-checkbox`}
        >
          {field.label}
        </div>
        <div
          class="text-base text-gray-900 font-small sm:text-sm sm:text-gray-700"
        >
          {field.hint}
        </div>
      </div>
      <div class="mt-4 sm:mt-0 sm:col-span-2">
        <div class="max-w-lg space-y-4">
          <div>
            {#each options as option, index}
              <Checkbox {field} {option} {index} />
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
