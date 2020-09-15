<template lang="pug">
  .score-colored-chip-wrapper(:class="wrapperClassName") {{ scoreTitle }}
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';
import { SymptomQuestionnaireResponse, SymptomQuestionnaireScoreRangeColor } from '~/types/gql';

export const ROUTE_NAME = '';

type Data = {};
type Methods = {};
type Computed = {
  wrapperClassName: string;
  scoreTitle: string;
};
export type Props = {
  score: SymptomQuestionnaireResponse['score'];
};
export type Events = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    score: {
      type: Object,
      required: true,
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    scoreTitle() {
      return this.score?.title || '';
    },
    wrapperClassName() {
      switch (this.score?.color) {
        case SymptomQuestionnaireScoreRangeColor.Green: return 'green';
        case SymptomQuestionnaireScoreRangeColor.GreenYellow: return 'green-yellow';
        case SymptomQuestionnaireScoreRangeColor.Yellow: return 'yellow';
        case SymptomQuestionnaireScoreRangeColor.Orange: return 'orange';
        case SymptomQuestionnaireScoreRangeColor.Red: return 'red';
        default: return '';
      }
    },
  },
});
</script>

<style lang="postcss" scoped>
.score-colored-chip-wrapper {
  @apply flex justify-center items-center rounded-full px-3 text-sm leading-loose w-max-content h-6;

  &.green {
    @apply bg-green-500 bg-opacity-20 text-green-500;
  }
  &.green-yellow {
    @apply bg-green-yellow bg-opacity-20 text-green-yellow;
  }
  &.yellow {
    @apply bg-yellow-500 bg-opacity-20 text-yellow-500;
  }
  &.orange {
    @apply bg-orange-500 bg-opacity-20 text-orange-500;
  }
  &.red {
    @apply bg-red-500 bg-opacity-20 text-red-500;
  }
}
</style>
