<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import LoadingIndicator from "../components/controls/LoadingIndicator.svelte";
  import Fields from "../components/plainhtml/FieldGenerator.svelte";
  import { createEventDispatcher } from "svelte";
  import ButtonArea from "../components/controls/ButtonArea.svelte";
  const dispatch = createEventDispatcher();

  /**
   * REQUIRED!
   *
   * You must export a form variable if this component
   * is being used in DynamicForm.
   */
  export let form;

  const handleSubmit = (e) => {
    console.log(e);

    dispatch("event", e);
  };

  onMount(() => {});

  onDestroy(() => {
    $form.destroy();
  });

  // $: valid = $form.valid;
  // $: changed = $form.changed;
  $: loading = $form.loading;

  let fw, fh;
</script>

<div>
  <div>
    <div>
      <section>
        <form
          use:$form.useForm
          on:submit|preventDefault={handleSubmit}
          bind:clientHeight={fh}
          bind:clientWidth={fw}
        >
          <div>
            <LoadingIndicator visible={$loading} w={fw} h={fh} />
            <div>
              <!-- Header Area -->
              <div>
                <h2>Plain HTML Form</h2>
                <p>This is a test. This is only a test. Bleep bloop.</p>
              </div>

              <!-- This is where the Form Generator "Magic" happens! -->

              <div>
                <Fields fields={$form.fields} />
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  </div>
</div>
