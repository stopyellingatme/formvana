<script>
  export let field;
  export let option;
  export let index;

  $: value = field.value;

  /** This allows us to update attributes dynamically */
  $: attributes = Object.assign(
    {
      autocomplete: "off",
      autocorrect: "off",
      spellcheck: false,
    },
    field.attributes || {}
  );

  $: checked =
    field.data_type === "object"
      ? JSON.stringify($value) == JSON.stringify(option.value)
      : $value == option.value;

  // $: console.log(
  //   checked,
  //   JSON.stringify($value) == JSON.stringify(option.value),
  //   JSON.stringify($value),
  //   JSON.stringify(option.value)
  // );

  $: opt_value =
    field.data_type === "object" ? JSON.stringify(option.value) : option.value;
</script>

<div class="flex items-center">
  <!-- 
    The parseInt thing is due to option.value becoming a string
    even if it's passed in as a number.
   -->
  <input
    name={field.name}
    bind:value={opt_value}
    type="radio"
    {checked}
    {...attributes}
    id={`${field.name}-${index}`}
    class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
  />
  <label
    for={`${field.name}-${index}`}
    class="block ml-3 text-sm font-medium text-gray-700"
  >
    {option.label}
  </label>
</div>
