<template lang="pug">
  .header-wrapper
    arrow-breadcrumbs(v-bind="breadcrumbs")
    .title-and-action-wrapper
      .title {{ title }}
      .action
        slot
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';
import ArrowBreadcrumbs, { Props as BreadcrumbsProps } from '@/components/atoms/ArrowBreadcrumbs.vue';

type Data = {};
type Methods = {};
type Computed = {};
export type Props = {
  breadcrumbs: BreadcrumbsProps;
  title: string;
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { ArrowBreadcrumbs },
  props: {
    breadcrumbs: {
      type: Object,
      required: true,
      default: () => ({ items: [] }),
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
  } as RecordPropsDefinition<Props>,
});
</script>

<style lang="postcss" scoped>
.header-wrapper {
  @apply flex flex-col justify-start w-full;

  .title-and-action-wrapper {
    @apply flex justify-between items-center mt-2;
    min-height: 3rem;

    .title {
      @apply text-2xl text-gray-800 font-bold;
    }
    .action {
      @apply flex;
    }
  }

}
</style>
