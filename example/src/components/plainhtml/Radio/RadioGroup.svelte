<script>
  import RadioButton from "./RadioButton.svelte";

  export let field;
  let options = field.options;
</script>

<div>
  <div role="group" aria-labelledby={`${field.name}-radio`}>
    <div>
      <div>
        <div id={`${field.name}-radio`}>
          {field.label}
        </div>
        <div>
          {field.hint}
        </div>
      </div>
      <div data-error-for={field.name} />
      <div>
        <div>
          <div>
            {#each options as option, index}
              <RadioButton {option} {index} {field} />
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
