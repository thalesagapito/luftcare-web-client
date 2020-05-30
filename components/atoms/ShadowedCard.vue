<template lang="pug">
  .shadowed-card-wrapper
    slot
</template>

<script lang="ts">
import Vue from 'vue';

type Data = {};
type Methods = {};
type Computed = {};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({});
</script>

<style lang="postcss" scoped>
  .shadowed-card-wrapper {
    @apply bg-white shadow-lg rounded-lg;
  }

</style>
