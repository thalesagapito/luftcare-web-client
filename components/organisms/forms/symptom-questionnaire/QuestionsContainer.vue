<template lang="pug">
  .questions-container-wrapper
    questions-stepper(
      v-bind="stepperProps"
      @update:activeStepNumber="activeStepNumber = $event"
      @update:questions="$set(questionnaireData, 'questions', $event)"
    )

    .current-question-form
      question-form(
        :question.sync="currentQuestion"
        :max-presentation-order="maxPresentationOrder"
        @update-presentation-order="updateQuestionsOrder"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { find, pull } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { RecordPropsDefinition } from 'vue/types/options';
import { Keyed } from '~/types/helpers';
import { CreateSymptomQuestionnaireQuestionInput, SymptomQuestionnaireQuestionKind } from '~/types/gql';
import QuestionForm, { Events as QuestionEvents } from '~/components/organisms/forms/symptom-questionnaire/QuestionForm.vue';
import QuestionsStepper, { Props as StepperProps } from '~/components/organisms/forms/symptom-questionnaire/QuestionsStepper.vue';


type DefaultQuestionGetter = (currentQuestionsLength: number) => Props['questions'][0];
export const getDefaultQuestion: DefaultQuestionGetter = (currentQuestionsLength: number) => ({
  nameForManagement: 'Pergunta',
  presentationOrder: currentQuestionsLength + 1,
  text: '',
  kind: SymptomQuestionnaireQuestionKind.MultipleChoice,
  possibleChoices: [],
  key: uuidv4(),
});

type Data = {
  activeStepNumber: number;
};
type Methods = {
  addNewQuestion: () => void;
  emitUpdate: (updatedQuestions: Props['questions']) => void;
  updateQuestion: (updatedQuestion: Props['questions'][0]) => void;
  deleteQuestion: (questionToDelete: QuestionEvents['delete-question']) => void;
  updateQuestionsOrder: (args: QuestionEvents['update-presentation-order']) => void;
};
type Computed = {
  stepperProps: StepperProps;
  maxPresentationOrder: number;
  currentQuestion: Props['questions'][0];
};
export type Props = {
  questions: Keyed<CreateSymptomQuestionnaireQuestionInput>[];
};
export type Events = {
  'update:questions': Props['questions'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { QuestionsStepper, QuestionForm },
  props: {
    questions: {
      type: Array,
      required: true,
      default: () => [],
    },
  } as RecordPropsDefinition<Props>,
  data() {
    return {
      activeStepNumber: 1,
    };
  },
  computed: {
    stepperProps() {
      return {
        activeStepNumber: this.activeStepNumber,
        questions: this.questions,
      };
    },
    maxPresentationOrder() {
      return this.questions.length;
    },
    currentQuestion: {
      get() {
        return find(
          this.questions,
          ['presentationOrder', this.activeStepNumber],
        ) as Computed['currentQuestion'];
      },
      set(updatedQuestion) {
        const updatedQuestions = this.questions.map((originalQuestion) => {
          const isCurrentQuestionTheOne = originalQuestion.presentationOrder === this.activeStepNumber;
          return isCurrentQuestionTheOne ? updatedQuestion : originalQuestion;
        });

        this.$emit<Events, 'update:questions'>('update:questions', updatedQuestions);
      },
    },
  },
  methods: {
    emitUpdate(updatedValue: Props['questions']) {
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
      this.activeStepNumber = newPresentationOrder;
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
