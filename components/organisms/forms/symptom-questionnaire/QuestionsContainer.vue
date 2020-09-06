<template lang="pug">
  .questions-container-wrapper
    client-only
      el-collapse(v-model="visibleIndex" accordion)
        transition-group(name="flip-list")
          question-form(
            v-for="(question) in orderedQuestions"
            :key="question.key"
            :question="question"
            :max-presentation-order="maxPresentationOrder"
            @update:question="updateQuestion($event)"
            @delete-question="deleteQuestion($event)"
            @update-presentation-order="updateQuestionsOrder"
          )
</template>

<script lang="ts">
import Vue from 'vue';
import { pull, sortBy } from 'lodash';
import { RecordPropsDefinition } from 'vue/types/options';
import { KeyedQuestionInput } from './types';
import { getDefaultQuestion } from './factoryFunctions';
import QuestionForm, { Props as QuestionProps, Events as QuestionEvents } from './QuestionForm.vue';

type Data = { visibleIndex: number; };
type Methods = {
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
    emitUpdate(updatedValue) {
      this.$emit<Events, 'update:questions'>('update:questions', updatedValue);
    },
    addNewQuestion() {
      const newQuestion = getDefaultQuestion(this.questions.length);
      const updatedQuestions = [...this.questions, newQuestion];

      this.emitUpdate(updatedQuestions);
    },
    deleteQuestion(questionToDelete) {
      const updatedQuestions = pull(this.questions, questionToDelete);
      const questionsWithNormalizedOrders = updatedQuestions.map((question) => {
        if (question.presentationOrder > questionToDelete.presentationOrder) {
          return { ...question, presentationOrder: question.presentationOrder - 1 };
        }
        return question;
      });
      this.emitUpdate(questionsWithNormalizedOrders);
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
  .current-question-form {
    @apply px-5 pt-4;
  }
}
</style>
