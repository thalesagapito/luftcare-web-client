<template lang="pug">
  div
    .score-ranges-container-wrapper
      client-only
        el-collapse(v-model="visibleIndex")
          transition-group(
            name="flip-list"
            @before-enter="beforeEnterList"
            @enter="enterList"
            @leave="leaveList"
          )
            score-range-form(
              v-for="(scoreRange) in orderedScoreRanges"
              :key="scoreRange.key"
              :scoreRange="scoreRange"
              :min-questionnaire-score="minQuestionnaireScore"
              :max-questionnaire-score="maxQuestionnaireScore"
              @update:scoreRange="updateScoreRange($event)"
              @delete-score-range="deleteScoreRange($event)"
            )
    .flex.justify-center.pt-1.px-1
      el-button.w-full(type="text" @click="addNewScoreRange") Adicionar intervalo
    hr.border-gray-200
</template>

<script lang="ts">
/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { pull, sortBy } from 'lodash';
import { VelocityCallbackFn } from 'velocity-animate';
import { RecordPropsDefinition } from 'vue/types/options';
import { KeyedScoreRangeInput } from './types';
import { getDefaultScoreRange } from './factoryFunctions';
import ScoreRangeForm, { Events as ScoreRangeEvents } from './ScoreRangeForm.vue';

type Data = { visibleIndex: number; };
type Methods = {
  beforeEnterList: (el: HTMLElement) => void;
  enterList: (el: HTMLElement, complete: VelocityCallbackFn) => void;
  leaveList: (el: HTMLElement, complete: VelocityCallbackFn) => void;
  addNewScoreRange: () => void;
  emitUpdate: (updatedScoreRanges: Props['scoreRanges']) => void;
  updateScoreRange: (updatedScoreRange: ScoreRangeEvents['update:scoreRange']) => void;
  deleteScoreRange: (scoreRangeToDelete: ScoreRangeEvents['delete-score-range']) => void;
};
type Computed = {
  orderedScoreRanges: Props['scoreRanges'];
};
export type Props = {
  scoreRanges: KeyedScoreRangeInput[];
  minQuestionnaireScore: number;
  maxQuestionnaireScore: number;
};
export type Events = {
  'update:scoreRanges': Props['scoreRanges'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { ScoreRangeForm },
  props: {
    scoreRanges: {
      type: Array,
      required: true,
      default: () => [],
    },
    minQuestionnaireScore: {
      type: Number,
      required: true,
      default: 0,
    },
    maxQuestionnaireScore: {
      type: Number,
      required: true,
      default: 0,
    },
  } as RecordPropsDefinition<Props>,
  data: () => ({ visibleIndex: 0 }),
  computed: {
    orderedScoreRanges() {
      return sortBy(this.scoreRanges, ['minScore']);
    },
  },
  methods: {
    beforeEnterList: (el) => {
      el.style.maxHeight = '0';
    },
    enterList(el, complete) {
      el.velocity({ maxHeight: '4rem' }, {
        duration: 400,
        easing: [0.14, 0.93, 0.72, 0.97],
        complete: () => {
          el.style.maxHeight = 'unset';
          return complete;
        },
      });
    },
    leaveList(el, complete) {
      const easing = [0.6, 1, 0.9, 1];
      const currentElementHeight = `${el.clientHeight}px`;
      el.velocity({ maxHeight: currentElementHeight }, { duration: 0 })
        .velocity!({ maxHeight: 0, opacity: 0 }, { duration: 400, easing, complete });
    },
    emitUpdate(updatedValue) {
      this.$emit<Events, 'update:scoreRanges'>('update:scoreRanges', updatedValue);
    },
    addNewScoreRange() {
      const minAndMaxPossibleScores = {
        minScore: this.minQuestionnaireScore,
        maxScore: this.maxQuestionnaireScore,
      };
      const newScoreRange = getDefaultScoreRange(this.scoreRanges, minAndMaxPossibleScores);
      const updatedScoreRanges = [...this.scoreRanges, newScoreRange];
      this.emitUpdate(updatedScoreRanges);
    },
    deleteScoreRange(scoreRangeToDelete) {
      // const deletedScoreRangeWasVisible = scoreRangeToDelete.presentationOrder === this.visibleIndex;
      const updatedScoreRanges = [...pull(this.scoreRanges, scoreRangeToDelete)];
      // const scoreRangesWithNormalizedOrders = updatedScoreRanges.map((scoreRange) => {
      //   if (scoreRange.presentationOrder > scoreRangeToDelete.presentationOrder) {
      //     return { ...scoreRange, presentationOrder: scoreRange.presentationOrder - 1 };
      //   }
      //   return scoreRange;
      // });
      this.emitUpdate(updatedScoreRanges);
      // if (deletedScoreRangeWasVisible) this.visibleIndex = 0;
    },
    updateScoreRange(updatedScoreRange) {
      const scoreRangesWithUpdatedScoreRange = this.scoreRanges.map((scoreRange) => {
        const isCurrentTheOneBeingUpdated = scoreRange.key === updatedScoreRange.key;
        return isCurrentTheOneBeingUpdated ? updatedScoreRange : scoreRange;
      });

      this.emitUpdate(scoreRangesWithUpdatedScoreRange);
    },
  },
});
</script>

<style lang="postcss" scoped>
.score-ranges-container-wrapper {
  @apply overflow-y-hidden;
}
</style>
