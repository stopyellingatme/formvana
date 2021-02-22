<script>
  export let name;
  export let classname;
  export let label;
</script>

<div class={classname}>
  <!-- Header Area -->
  <!-- <slot name="group-header" /> -->
  <h2 class="text-lg font-medium leading-6 text-gray-900">{label}</h2>

  <!-- Form Wrapper Div (col num, col gaps, etc.) -->
  <div class={$form.form_classes[2]} />
</div>
