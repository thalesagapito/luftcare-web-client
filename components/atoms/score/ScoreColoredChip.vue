<template lang="pug">
  .score-colored-chip-wrapper(:class="wrapperClassName") {{ scoreTitle }}
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';
import { QuestionnaireResponse, QuestionnaireScoreRangeColor } from '~/types/gql';

type Data = {};
type Methods = {};
type Computed = {
  wrapperClassName: string;
  scoreTitle: string;
};
export type Props = {
  score: QuestionnaireResponse['score'];
  isValueVisible: boolean;
};
export type Events = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    score: {
      type: Object,
      required: true,
    },
    isValueVisible: {
      type: Boolean,
      required: false,
      default: false,
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    scoreTitle() {
      const { title, value } = this.score;
      if (this.isValueVisible) return `${value} - ${title}`;

      return this.score?.title || '';
    },
    wrapperClassName() {
      switch (this.score?.color) {
        case QuestionnaireScoreRangeColor.Green: return 'green';
        case QuestionnaireScoreRangeColor.GreenYellow: return 'green-yellow';
        case QuestionnaireScoreRangeColor.Yellow: return 'yellow';
        case QuestionnaireScoreRangeColor.Orange: return 'orange';
        case QuestionnaireScoreRangeColor.Red: return 'red';
        default: return '';
      }
    },
  },
});
</script>

<style lang="postcss" scoped>
.score-colored-chip-wrapper {
  @apply flex justify-center items-center rounded-full px-3 text-sm leading-loose w-max-content h-6;
  padding-top: 2px;

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
