<template lang="pug">
  el-form.question-form-wrapper(v-bind="formProps")
    .mb-7: el-form-item(label="Ordem da pergunta" prop="presentationOrder")
      .form-item-helper-text
        |Posição em que a pergunta vai aparecer no questionário
      el-input-number(
        :min="1"
        :max="maxPresentationOrder"
        :value="question.presentationOrder"
        @change="updateQuestionPresentationOrder($event)"
      )

    .mb-7: el-form-item(label="Nome da pergunta para uso interno" prop="nameForManagement")
      .form-item-helper-text
        |Esse é o nome que será mostrado apenas no painel de controle, nenhum paciente tem acesso.
      el-input(
        autofocus
        type="text"
        maxlength="500"
        placeholder="Digite aqui"
        :value="question.nameForManagement"
        @input="updateQuestionField($event, 'nameForManagement')"
      )

    .mb-7: el-form-item(label="Enunciado da pergunta" prop="text")
      .form-item-helper-text
        |O enunciado da pergunta que será mostrado ao paciente.
      el-input(
        show-word-limit
        type="textarea"
        maxlength="500"
        placeholder="Digite aqui"
        :value="question.text"
        :autosize="{ minRows: 4 }"
        @input="updateQuestionField($event, 'text')"
      )

    .mb-7: el-form-item(label="Tipo da pergunta" prop="kind")
      el-select(
        :value="question.kind"
        @input="updateQuestionField($event, 'kind')"
      )
        el-option(
          v-for="option in questionKindSelectOptions"
          :key="option.label"
          v-bind="option"
        )


    .question-choices-wrapper(v-if="isQuestionMultipleChoice")
      .header
        .title Alternativas da pergunta
        el-button(type="default" size="mini" @click="addNewChoice") Adicionar alternativa

      template(v-if="question.possibleChoices.length === 0")
        .text-gray-500.mt-2 Nenhuma pergunta no questionário, adicione uma com o botão acima.
      template(v-else)
        choice-form.my-5.shadow-sm(
          v-for="choice in orderedChoices"
          :choice="choice"
          :key="choice.presentationOrder"
          :max-presentation-order="maxChoicePresentationOrder"
          @delete-choice="deleteChoice(choice)"
        )


    //- pre {{ isQuestionMultipleChoice }}

    //- pre {{ question }}
</template>

<script lang="ts">
import Vue from 'vue';
import { sortBy, pull } from 'lodash';
import { Option } from 'element-ui';
import { RecordPropsDefinition } from 'vue/types/options';
import { ElFormProps } from '~/types/element-ui';
import {
  SymptomQuestionnaireQuestionKind,
  CreateSymptomQuestionnaireQuestionInput,
  CreateSymptomQuestionnaireQuestionChoiceInput,
} from '~/types/gql';
import ChoiceForm, { Props as ChoiceProps, Events as ChoiceEvents } from '~/components/organisms/forms/symptom-questionnaire/QuestionChoiceForm.vue';

// const a: ChoiceEvents['update-presentation-order']
// const a: ChoiceEvents['update:choice']
// const a: ChoiceEvents['delete-choice']
type Data = {};
type Methods = {
  addNewChoice: () => void;
  deleteChoice: (choiceToDelete: ChoiceEvents['delete-choice']) => void;
  updateQuestionField: (value: any, fieldName: keyof Props['question']) => void;
  updateQuestionPresentationOrder: (newPresentationOrder: number) => void;
};
type Computed = {
  formProps: ElFormProps<keyof CreateSymptomQuestionnaireQuestionInput>;
  questionKindSelectOptions: Partial<Option>[];
  isQuestionMultipleChoice: boolean;
  orderedChoices: Props['question']['possibleChoices'];
  maxChoicePresentationOrder: ChoiceProps['maxPresentationOrder'];
};
export type Props = {
  question: CreateSymptomQuestionnaireQuestionInput;
  maxPresentationOrder: number;
};
export type Events = {
  'update-presentation-order': { oldPresentationOrder: number; newPresentationOrder: number };
  'update:question': CreateSymptomQuestionnaireQuestionInput;
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { ChoiceForm },
  props: {
    question: {
      type: Object,
      required: true,
      default: () => ({
        text: '',
        possibleChoices: [],
        presentationOrder: 1,
        nameForManagement: '',
        kind: SymptomQuestionnaireQuestionKind.MultipleChoice,
      }),
    },
    maxPresentationOrder: {
      type: Number,
      required: true,
      default: 1,
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    formProps() {
      return {
        size: 'small',
        model: {
          text: this.question.text,
          kind: this.question.kind,
          possibleChoices: this.question.possibleChoices,
          presentationOrder: this.question.presentationOrder,
          nameForManagement: this.question.nameForManagement,
        },
        rules: {
          kind: [],
          possibleChoices: [],
          presentationOrder: [{ type: 'number', required: true }],
          text: [{
            type: 'string', required: true, max: 500, message: 'Obrigatório',
          }],
          nameForManagement: [{
            type: 'string', required: true, max: 500, message: 'Obrigatório',
          }],
        },
      };
    },
    questionKindSelectOptions() {
      return [
        { value: SymptomQuestionnaireQuestionKind.MultipleChoice, label: 'Múltipla escolha' },
        { value: SymptomQuestionnaireQuestionKind.FreeResponse, label: 'Texto livre' },
      ];
    },
    isQuestionMultipleChoice() {
      return this.question.kind === SymptomQuestionnaireQuestionKind.MultipleChoice;
    },
    orderedChoices() {
      return sortBy(this.question.possibleChoices, ['presentationOrder']);
    },
    maxChoicePresentationOrder() {
      return this.question.possibleChoices?.length || 1;
    },
  },
  methods: {
    updateQuestionField(value, fieldName) {
      const newQuestionValue = { ...this.question, [fieldName]: value };
      this.$emit<Events, 'update:question'>('update:question', newQuestionValue);
    },
    updateQuestionPresentationOrder(newPresentationOrder) {
      const eventArgs = {
        oldPresentationOrder: this.question.presentationOrder,
        newPresentationOrder,
      };
      this.$emit<Events, 'update-presentation-order'>('update-presentation-order', eventArgs);
    },
    addNewChoice() {
      const newChoice: CreateSymptomQuestionnaireQuestionChoiceInput = {
        nameForManagement: 'Alternativa sem nome',
        presentationOrder: (this.question.possibleChoices?.length || 0) + 1,
        text: '',
        value: 1,
      };
      const currentChoices = this.question.possibleChoices || [];
      const updatedQuestionChoicesArray = [...currentChoices, newChoice];

      this.updateQuestionField(updatedQuestionChoicesArray, 'possibleChoices');
    },
    deleteChoice(choiceToDelete) {
      const updatedQuestionChoices = pull(this.question.possibleChoices || [], choiceToDelete);
      this.updateQuestionField(updatedQuestionChoices, 'possibleChoices');
    },
  },
});
</script>

<style lang="postcss" scoped>
.question-form-wrapper {
  .question-choices-wrapper {
    .header {
      @apply flex items-center;
      .title {
        @apply font-bold text-gray-700 mr-2;
      }
    }
  }
}
</style>
