<script lang="ts">
  export let errorsStore = null;
</script>

{#if $errorsStore.includes('type')}
  <p class="mt-2 text-sm text-red-600">Please enter a valid email address.</p>
{/if}
{#if $errorsStore.includes('required')}
  <p class="mt-2 text-sm text-red-600">This field is required.</p>
{/if}
{#if $errorsStore.includes('password_pattern')}
  <p class="mt-2 text-sm text-red-600">
    The password must have a minimum of 6 characters, at least 1 uppercase
    letter, 1 lowercase letter, and 1 number with no spaces.
  </p>
{/if}

{#if $errorsStore.includes('password_confirm')}
  <p class="mt-2 text-sm text-red-600">
    The passwords must match. Which they do not. Fix it.
  </p>
{/if}
