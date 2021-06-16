<script>
  import Checkbox from "./CheckboxButton.svelte";

  export let field;
  let options = field.options;
</script>

<div>
  <div role="group" aria-labelledby={`${field.name}-checkbox`}>
    <div>
      <div>
        <div id={`${field.name}-checkbox`}>
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
              <Checkbox {field} {option} {index} />
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
