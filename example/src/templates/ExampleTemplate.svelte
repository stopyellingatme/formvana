<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import LoadingIndicator from "../components/inputs/LoadingIndicator.svelte";
  import Field from "../components/inputs/Field.svelte";
  import { createEventDispatcher } from "svelte";
  import ButtonArea from "../components/ButtonArea.svelte";
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

  $: valid = $form.valid;
  $: changed = $form.changed;
  $: loading = $form.loading;

  let fw, fh;
</script>

<div class="px-8 py-2 pb-10 mx-auto max-w-7xl">
  <div class="flex items-start justify-center">
    <div class="w-full space-y-6">
      <section>
        <form
          on:submit|preventDefault={handleSubmit}
          bind:clientHeight={fh}
          bind:clientWidth={fw}
        >
          <div class="shadow sm:rounded-md">
            <LoadingIndicator visible={$loading} w={fw} h={fh} />
            <div class="px-4 py-6 bg-white sm:p-6">
              <!-- Header Area -->
              <div>
                <h2 class="text-lg font-medium leading-6 text-gray-900">
                  Example Form
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                  This is a test. This is only a test. Bleep bloop.
                </p>
              </div>

              <!-- This is where the Form Generator "Magic" happens! -->
              <div class="grid grid-cols-4 gap-6 mt-6">
                {#each $form.fields as field, i}
                  <Field {field} {form} />
                {/each}
              </div>
            </div>

            <ButtonArea reset={$form.reset} {valid} {changed} />
          </div>
        </form>
      </section>
    </div>
  </div>
</div>
