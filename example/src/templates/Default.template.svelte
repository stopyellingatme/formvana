<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import LoadingIndicator from "../components/inputs/LoadingIndicator.svelte";
  import Field from "../components/inputs/Field.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /**
   * REQUIRED!
   *
   * You must export a form variable if this component
   * is being used in DynamicForm.
   */
  export let form;
  export let group_num;

  const handleSubmit = (e) => {
    console.log(e);

    dispatch("event", e);
  };

  onMount(() => {});

  onDestroy(() => {
    $form.destroy();
  });

  $: loading = $form.loading;

  let fw, fh;
</script>

<div class="py-2 mx-auto max-w-7xl lg:px-8">
  <div class="flex items-start justify-center">
    <div class="w-full space-y-6">
      <section>
        <form
          use:$form.useForm
          on:submit|preventDefault={handleSubmit}
          bind:clientHeight={fh}
          bind:clientWidth={fw}
        >
          <div class="rounded-md">
            <LoadingIndicator visible={$loading} w={fw} h={fh} />
            <div class="px-4 py-6 bg-white sm:p-6">
              <!-- Header Area -->
              <div>
                <h2 class="text-lg font-medium leading-6 text-gray-900">
                  Group {group_num + 1}
                </h2>
              </div>

              <!-- Form Wrapper Div (col num, col gaps, etc.) -->
              <div class="grid grid-cols-2 gap-6 mt-6">
                <!-- This is where the Form Generator Magic happens! -->
                {#each $form.fields as field, i}
                  <Field {field} />
                {/each}
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  </div>
</div>
