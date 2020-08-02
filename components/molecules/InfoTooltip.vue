<template lang="pug">
  el-tooltip(v-bind="$props")
    template(v-slot:content)
      .text-center(v-html="content")
    i.el-icon-info.text-lg.text-lapis
</template>

<script lang="ts">
import Vue from 'vue';
import { Tooltip } from 'element-ui';
import { RecordPropsDefinition } from 'vue/types/options';

type Data = {};
type Methods = {};
type Computed = {};
export type Props = Partial<Tooltip>;

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    content: {
      type: String,
      required: false,
    },
    placement: {
      type: String,
      required: false,
      default: 'top',
    },
    effect: {
      type: String,
      required: false,
      default: 'light',
    },
  } as RecordPropsDefinition<Props>,
});
</script>

<style lang="postcss" scoped>

</style>
