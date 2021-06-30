<script>
  import { validate } from "class-validator";
  import { Form, ValidationError } from "@formvana";
  import { UserExampleModel } from "./models/UserExampleModel";
  import ButtonArea from "./components/controls/ButtonArea.svelte";

  const validator = (model, options) => {
    return validate(model, options).then((errors) => {
      return errors.map((error) => {
        return new ValidationError(error.property, error.constraints);
      });
    });
  };

  const options = {
    validator: validator,
    // error_display: {
    //   dom: {
    //     type: "ol",
    //     error_classes: ["text-sm", "text-red-600", "mt-2"],
    //   },
    // },
    error_display: "constraint",
  };

  $: form = new Form(new UserExampleModel(), options);

  $: valid = form.valid;
  $: changed = form.changed;
</script>

<form
  use:form.useForm
  class="flex flex-col w-full justify-items-center items-centers"
>
  <h2>Simple Exmaple</h2>
  <br />

  <div class="grid grid-cols-2 gap-6 mt-6">
    {#each form.fields as field}
      <div class="flex flex-col p-2">
        {#if field.selector === "textarea"}
          <label for={field.name}>{field.label}</label>
          <textarea
            class="p-1 border-2 border-gray-700 rounded"
            name={field.name}
            rows="3"
            {...field.attributes}
          />
        {:else if field.selector === "file"}
          <!-- Show Nothing -->
          <div class="sr-only" />
        {:else}
          <label for={field.name}>{field.label}</label>
          <input
            class="p-1 border-2 border-gray-700 rounded"
            name={field.name}
            {...field.attributes}
          />
        {/if}

        <div data-error-for={field.name} />
      </div>
    {/each}
  </div>
</form>

<div class="px-8 py-2 pb-12 mx-auto max-w-7xl">
  <ButtonArea reset={form.reset} {valid} {changed} />
</div>
