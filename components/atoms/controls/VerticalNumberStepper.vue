<template lang="pug">
  .vertical-number-stepper-wrapper
    el-button(
      icon="el-icon-arrow-up"
      :disabled="isArrowUpDisabled"
      @click="onArrowUpClick"
    )
    .number {{ value }}
    el-button(
      icon="el-icon-arrow-down"
      :disabled="isArrowDownDisabled"
      @click="onArrowDownClick"
    )
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';

type Data = {};
type Methods = {
  onArrowUpClick: () => void;
  onArrowDownClick: () => void;
  increaseValue: () => void;
  decreaseValue: () => void;
};
type Computed = {
  isArrowUpDisabled: boolean;
  isArrowDownDisabled: boolean;
};
export type Props = {
  value: number;
  minValue: number;
  maxValue: number;
  isInverted: boolean;
};
export type Events = {
  'input': number;
};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    value: { type: Number, required: true, default: 0 },
    minValue: { type: Number, required: false, default: -Infinity },
    maxValue: { type: Number, required: false, default: Infinity },
    isInverted: { type: Boolean, required: false, default: false },
  } as RecordPropsDefinition<Props>,
  computed: {
    isArrowUpDisabled() {
      return this.isInverted ? this.value === this.minValue : this.value === this.maxValue;
    },
    isArrowDownDisabled() {
      return this.isInverted ? this.value === this.maxValue : this.value === this.minValue;
    },
  },
  methods: {
    onArrowUpClick() {
      return this.isInverted ? this.decreaseValue() : this.increaseValue();
    },
    onArrowDownClick() {
      return this.isInverted ? this.increaseValue() : this.decreaseValue();
    },
    increaseValue() {
      const newValue = this.value + 1;
      const cappedValue = Math.min(newValue, this.maxValue);
      this.$emit<Events, 'input'>('input', cappedValue);
    },
    decreaseValue() {
      const newValue = this.value - 1;
      const cappedValue = Math.max(newValue, this.minValue);
      this.$emit<Events, 'input'>('input', cappedValue);
    },
  },
});
</script>

<style lang="postcss" scoped>
.vertical-number-stepper-wrapper {
  @apply flex flex-col items-center;

  .number {
    @apply my-1;
  }

  & >>> button {
    @apply shadow-none;
  }
}
</style>
