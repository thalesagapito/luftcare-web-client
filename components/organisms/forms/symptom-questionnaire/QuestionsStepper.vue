<template lang="pug">
  el-steps.questions-stepper(v-bind="stepperProps")
    el-step(
      v-for="question in orderedQuestions"
      :key="question.key"
      :title="question.nameForManagement || 'Pergunta sem nome'"
      :icon="getStepIcon(question)"
      :status="getStepStatus(question)"
      @click.native="updateActiveStepNumber(question.presentationOrder)"
    )
</template>

<script lang="ts">
import Vue from 'vue';
import { sortBy } from 'lodash';
import { Steps, Step } from 'element-ui';
import { RecordPropsDefinition } from 'vue/types/options';
import { KeyedQuestion } from './QuestionForm.vue';

type Data = {};
type Methods = {
  getStepIcon: (question: Props['questions'][0]) => Step['icon'];
  getStepStatus: (question: Props['questions'][0]) => Step['status'];
  updateActiveStepNumber: (newStepNumber: number) => void;
};
type Computed = {
  stepperProps: Partial<Steps>;
  orderedQuestions: Props['questions'];
};
export type Props = {
  activeStepNumber: number;
  questions: KeyedQuestion[];
};
export type Events = {
  'update:activeStepNumber': Props['activeStepNumber'];
  'update:questions': Props['questions'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    activeStepNumber: {
      type: Number,
      default: 1,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
      default: () => [],
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    stepperProps() {
      return {
        simple: true,
        active: this.activeStepNumber,
      };
    },
    orderedQuestions() {
      return sortBy(this.questions, ['presentationOrder']);
    },
  },
  methods: {
    updateActiveStepNumber(newActiveStepNumber) {
      this.$emit<Events, 'update:activeStepNumber'>('update:activeStepNumber', newActiveStepNumber);
    },
    getStepStatus({ presentationOrder }) {
      const isCurrentQuestion = presentationOrder === this.activeStepNumber;
      return isCurrentQuestion ? 'process' : 'wait';
    },
    getStepIcon({ isValid }) {
      return isValid ? 'el-icon-success' : 'el-icon-error';
    },
  },
});
</script>

<style lang="postcss" scoped>
.questions-stepper {
  @apply rounded-lg px-4;

  /* .el-step.is-simple >>> .el-step__head {
    @apply hidden;
  } */
  .el-step.is-simple >>> .el-step__title {
    @apply break-normal text-center text-base cursor-pointer;
  }
}
</style>
