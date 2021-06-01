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

<div class="px-8 py-2 mx-auto max-w-7xl">
  <div class="flex items-start justify-center">
    <div class="w-full space-y-6">
      <section>
        <form
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
                <p class="mt-1 text-sm text-gray-500">
                  Description for form #{group_num + 1}
                </p>
              </div>

              <!-- Form Wrapper Div (col num, col gaps, etc.) -->
              <div class="grid grid-cols-4 gap-6 mt-6">
                <!-- This is where the Form Generator Magic happens! -->
                {#each $form.fields as field, i}
                  <Field {field} {form} />
                {/each}
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  </div>
</div>
