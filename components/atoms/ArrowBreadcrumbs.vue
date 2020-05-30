<template lang="pug">
  el-breadcrumb(separator=">")
    el-breadcrumb-item(v-for="({ label, to }) in items" :to="to" :key="to") {{ label }}
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';

type BreadcrumbItem = {
  label: string;
  to: string;
};

type Data = {};
type Methods = {};
type Computed = {};
export type Props = {
  items: BreadcrumbItem[]
};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
  } as RecordPropsDefinition<Props>,
});
</script>

<style lang="postcss" scoped>

</style>
