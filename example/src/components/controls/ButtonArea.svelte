<script>
  import Button from "./Button.svelte";

  export let changed;
  export let valid;
  export let reset;

  export let stepper_data = null;

  $: active_step = stepper_data && stepper_data.active_step;
</script>

<!-- Button Area -->
<div
  class="flex {stepper_data
    ? 'justify-between'
    : 'justify-end'}  px-4 py-3 text-right bg-gray-50 sm:px-6"
>
  {#if stepper_data}
    <div class="float-left space-x-4">
      <Button
        type="button"
        action={stepper_data.backStep}
        label={"Back"}
        disabled={$active_step === 0}
      />
      <Button
        type="button"
        action={stepper_data.nextStep}
        label={"Next"}
        disabled={stepper_data.forms.length === $active_step + 1}
      />
    </div>
  {/if}
  <div class="float-right">
    <Button
      type="button"
      action={reset}
      label={$changed ? "Changed" : "Unchanged"}
      disabled={!$changed}
    />
    <Button
      action={null}
      type="submit"
      label={$valid ? "Valid" : "Invalid"}
      disabled={!$valid}
    />
    <Button
      type="button"
      action={reset}
      label={$valid && $changed
        ? "Valid &amp; Changed"
        : "Invalid OR Unchanged"}
      disabled={!$changed || !$valid}
    />
  </div>
</div>
