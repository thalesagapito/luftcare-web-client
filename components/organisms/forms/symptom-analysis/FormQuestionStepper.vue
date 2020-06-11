<template lang="pug">
  el-steps.questions-stepper(v-bind="stepperProps")
    el-step(
      v-for="({ nameForManagement, presentationOrder }) in orderedQuestions"
      icon="_"
      :key="presentationOrder"
      :title="nameForManagement || 'Pergunta sem nome'"
      :status="activeStepNumber === presentationOrder ? 'finish' : 'wait'"
      @click.native="updateActiveStepNumber(presentationOrder)"
    )
</template>

<script lang="ts">
import Vue from 'vue';
import { sortBy } from 'lodash';
import { Steps } from 'element-ui';
import { RecordPropsDefinition } from 'vue/types/options';
import { CreateSymptomQuestionnaireQuestionInput } from '~/types/gql';

type Data = {};
type Methods = {
  updateActiveStepNumber: (newStepNumber: number) => void;
};
type Computed = {
  stepperProps: Partial<Steps>;
  orderedQuestions: Props['questions'];
};
export type Props = {
  activeStepNumber: number;
  questions: CreateSymptomQuestionnaireQuestionInput[];
};
export type Events = {
  'update:activeStepNumber': number;
  'update:questions': CreateSymptomQuestionnaireQuestionInput[];
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
    updateActiveStepNumber(newActiveStepNumber: number) {
      this.$emit<Events, 'update:activeStepNumber'>('update:activeStepNumber', newActiveStepNumber);
    },
  },
});
</script>

<style lang="postcss" scoped>
.questions-stepper {
  @apply rounded-lg px-4;

  .el-step.is-simple >>> .el-step__head {
    @apply hidden;
  }
  .el-step.is-simple >>> .el-step__title {
    @apply break-normal text-center text-base cursor-pointer;
  }
}
</style>
