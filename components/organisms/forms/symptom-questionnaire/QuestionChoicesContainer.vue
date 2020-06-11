<template lang="pug">
  .py-5
    transition-group(name="flip-list")
      choice-form.my-5.shadow-sm(
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
import { sortBy, pull } from 'lodash';
import { RecordPropsDefinition } from 'vue/types/options';
import { Keyed } from '~/types/helpers';
import { CreateSymptomQuestionnaireQuestionChoiceInput } from '~/types/gql';
import ChoiceForm, { Events as ChoiceEvents } from '~/components/organisms/forms/symptom-questionnaire/QuestionChoiceForm.vue';


type DefaultChoiceGetter = (currentChoicesLength: number) => Props['choices'][0];
export const getDefaultChoice: DefaultChoiceGetter = (currentChoicesLength: number) => ({
  nameForManagement: 'Alternativa sem nome',
  presentationOrder: currentChoicesLength + 1,
  text: '',
  value: 1,
  key: uuidv4(),
});

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
  choices: Keyed<CreateSymptomQuestionnaireQuestionChoiceInput>[];
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
    emitUpdate(updatedValue: Props['choices']) {
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
.flip-list-move {
  transition: transform .5s;
}
</style>
