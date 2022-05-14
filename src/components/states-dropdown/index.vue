<template>
  <b-form-select
    v-bind="$attrs"
    v-on="$listeners"
    text-field="name"
    value-field="abbreviation"
    :options="states"
  />
</template>

<script>
import states from './states.json';
export default {
  data:() => {
    return {
      states
    }
  }
}
</script>