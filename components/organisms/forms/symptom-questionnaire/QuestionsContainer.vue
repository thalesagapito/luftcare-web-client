<template lang="pug">
  div
    .questions-container-wrapper
      client-only
        el-collapse(v-model="visibleIndex" accordion)
          transition-group(
            name="flip-list"
            @before-enter="beforeEnterList"
            @enter="enterList"
            @leave="leaveList"
          )
            question-form(
              v-for="(question) in orderedQuestions"
              :key="question.key"
              :question="question"
              :max-presentation-order="maxPresentationOrder"
              @update:question="updateQuestion($event)"
              @delete-question="deleteQuestion($event)"
              @update-presentation-order="updateQuestionsOrder"
            )
    .flex.justify-center.pt-1.px-1
      el-button.w-full(type="text" @click="addNewQuestion") Adicionar pergunta
    hr.border-gray-200
</template>

<script lang="ts">
/* eslint-disable no-param-reassign */
import Vue from 'vue';
import { pull, sortBy } from 'lodash';
import { VelocityCallbackFn } from 'velocity-animate';
import { RecordPropsDefinition } from 'vue/types/options';
import { KeyedQuestionInput } from './types';
import { getDefaultQuestion } from './factoryFunctions';
import QuestionForm, { Props as QuestionProps, Events as QuestionEvents } from './QuestionForm.vue';

type Data = { visibleIndex: number; };
type Methods = {
  beforeEnterList: (el: HTMLElement) => void;
  enterList: (el: HTMLElement, complete: VelocityCallbackFn) => void;
  leaveList: (el: HTMLElement, complete: VelocityCallbackFn) => void;
  addNewQuestion: () => void;
  emitUpdate: (updatedQuestions: Props['questions']) => void;
  updateQuestion: (updatedQuestion: QuestionEvents['update:question']) => void;
  deleteQuestion: (questionToDelete: QuestionEvents['delete-question']) => void;
  updateQuestionsOrder: (args: QuestionEvents['update-presentation-order']) => void;
};
type Computed = {
  orderedQuestions: Props['questions'];
  maxPresentationOrder: QuestionProps['maxPresentationOrder'];
};
export type Props = {
  questions: KeyedQuestionInput[];
};
export type Events = {
  'update:questions': Props['questions'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { QuestionForm },
  props: {
    questions: {
      type: Array,
      required: true,
      default: () => [],
    },
  } as RecordPropsDefinition<Props>,
  data: () => ({ visibleIndex: 0 }),
  computed: {
    orderedQuestions() {
      return sortBy(this.questions, ['presentationOrder']);
    },
    maxPresentationOrder() {
      return this.questions.length;
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
      this.$emit<Events, 'update:questions'>('update:questions', updatedValue);
    },
    addNewQuestion() {
      const newQuestion = getDefaultQuestion(this.questions.length);
      const updatedQuestions = [...this.questions, newQuestion];
      this.emitUpdate(updatedQuestions);
    },
    deleteQuestion(questionToDelete) {
      const deletedQuestionWasVisible = questionToDelete.presentationOrder === this.visibleIndex;
      const updatedQuestions = pull(this.questions, questionToDelete);
      const questionsWithNormalizedOrders = updatedQuestions.map((question) => {
        if (question.presentationOrder > questionToDelete.presentationOrder) {
          return { ...question, presentationOrder: question.presentationOrder - 1 };
        }
        return question;
      });
      this.emitUpdate(questionsWithNormalizedOrders);
      if (deletedQuestionWasVisible) this.visibleIndex = 0;
    },
    updateQuestionsOrder({ oldPresentationOrder, newPresentationOrder }) {
      const questionsWithUpdatedOrders = this.questions.map((question) => {
        if (question.presentationOrder === oldPresentationOrder) {
          return { ...question, presentationOrder: newPresentationOrder };
        }

        if (question.presentationOrder === newPresentationOrder) {
          return { ...question, presentationOrder: oldPresentationOrder };
        }
        return question;
      });

      this.emitUpdate(questionsWithUpdatedOrders);
    },
    updateQuestion(updatedQuestion) {
      const questionsWithUpdatedQuestion = this.questions.map((question) => {
        const isCurrentTheOneBeingUpdated = question.presentationOrder === updatedQuestion.presentationOrder;
        return isCurrentTheOneBeingUpdated ? updatedQuestion : question;
      });

      this.emitUpdate(questionsWithUpdatedQuestion);
    },
  },
});
</script>

<style lang="postcss" scoped>
.questions-container-wrapper {
  @apply overflow-y-hidden;

  .current-question-form {
    @apply px-5 pt-4;
  }
}
</style>
