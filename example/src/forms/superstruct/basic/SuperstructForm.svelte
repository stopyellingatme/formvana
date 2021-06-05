<script lang="ts">
  import { onMount, tick } from "svelte";
  import { onSubmit, init, form_state } from "./superstruct.form";
  import DynamicForm from "../../DynamicForm.svelte";

  onMount(() => {
    tick();
    init();
  });

  const handleSubmit = (e) => {
    console.log("SUBMIT!");

    // console.log("MADE IT HERE -- ", e);

    // $form_state.validate();
  };
</script>

<DynamicForm form={form_state} on:submit={handleSubmit} />
