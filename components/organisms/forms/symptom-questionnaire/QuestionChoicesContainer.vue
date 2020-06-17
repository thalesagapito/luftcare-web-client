<template lang="pug">
  .question-choices-container-wrapper
    transition-group(name="flip-list")
      choice-form.choice(
        v-for="choice in orderedChoices"
        :choice="choice"
        :key="choice.key"
        :max-presentation-order="maxPresentationOrder"
        @update:choice="updateChoice($event)"
        @delete-choice="deleteChoice(choice)"
        @update-presentation-order="updateChoicesOrder($event)"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { sortBy, pull, omit } from 'lodash';
import { RecordPropsDefinition } from 'vue/types/options';
import { SymptomQuestionnaireQuestionChoiceInput } from '~/types/gql';
import ChoiceForm, { Events as ChoiceEvents } from '~/components/organisms/forms/symptom-questionnaire/QuestionChoiceForm.vue';

type DefaultChoiceGetter = (currentChoicesLength: number) => Props['choices'][0];
export const getDefaultChoice: DefaultChoiceGetter = (currentChoicesLength) => ({
  nameForManagement: '',
  presentationOrder: currentChoicesLength + 1,
  text: '',
  value: 1,
  key: uuidv4(),
});

type ChoiceKeyRemover = (choices: Props['choices']) => Props['choices'];
export const removeKeysFromChoices: ChoiceKeyRemover = (choices) => {
  const choicesWithoutKeys = choices.map((currentChoice) => omit(currentChoice, 'key'));
  return choicesWithoutKeys;
};

type Data = {};
type Methods = {
  addNewChoice: () => void;
  emitUpdate: (updatedChoices: Props['choices']) => void;
  updateChoice: (updatedChoice: Props['choices'][0]) => void;
  deleteChoice: (choiceToDelete: ChoiceEvents['delete-choice']) => void;
  updateChoicesOrder: (args: ChoiceEvents['update-presentation-order']) => void;
};
type Computed = {
  orderedChoices: Props['choices'];
  maxPresentationOrder: number;
};
export type Props = {
  choices: SymptomQuestionnaireQuestionChoiceInput[];
};
export type Events = {
  'update:choices': Props['choices'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { ChoiceForm },
  props: {
    choices: {
      type: Array,
      required: true,
      default: () => [],
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    orderedChoices() {
      return sortBy(this.choices, ['presentationOrder']);
    },
    maxPresentationOrder() {
      return this.choices.length;
    },
  },
  methods: {
    emitUpdate(updatedValue) {
      this.$emit<Events, 'update:choices'>('update:choices', updatedValue);
    },
    addNewChoice() {
      const newChoice = getDefaultChoice(this.choices.length);
      const updatedChoices = [...this.choices, newChoice];

      this.emitUpdate(updatedChoices);
    },
    deleteChoice(choiceToDelete) {
      const updatedChoices = pull(this.choices, choiceToDelete);
      const choicesWithNormalizedOrders = updatedChoices.map((choice) => {
        if (choice.presentationOrder > choiceToDelete.presentationOrder) {
          return { ...choice, presentationOrder: choice.presentationOrder - 1 };
        }
        return choice;
      });
      this.emitUpdate(choicesWithNormalizedOrders);
    },
    updateChoicesOrder({ oldPresentationOrder, newPresentationOrder }) {
      const choicesWithUpdatedOrders = this.choices.map((choice) => {
        if (choice.presentationOrder === oldPresentationOrder) {
          return { ...choice, presentationOrder: newPresentationOrder };
        }
        if (choice.presentationOrder === newPresentationOrder) {
          return { ...choice, presentationOrder: oldPresentationOrder };
        }
        return choice;
      });

      this.emitUpdate(choicesWithUpdatedOrders);
    },
    updateChoice(updatedChoice) {
      const choicesWithUpdatedChoice = this.choices.map((choice) => {
        const isCurrentTheOneBeingUpdated = choice.presentationOrder === updatedChoice.presentationOrder;
        return isCurrentTheOneBeingUpdated ? updatedChoice : choice;
      });

      this.emitUpdate(choicesWithUpdatedChoice);
    },
  },
});
</script>

<style lang="postcss" scoped>
.question-choices-container-wrapper {
  @apply px-4;
  .flip-list-move {
    transition: transform .5s;
  }

  .choice {
    @apply mt-5 shadow-sm;
  }
}
</style>
