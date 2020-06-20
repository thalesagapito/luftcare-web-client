<template lang="pug">
  el-form.question-form-wrapper(v-bind="formProps")
    .delete
      el-button(
        plain
        size="mini"
        type="danger"
        @click="emitDelete"
      ) Remover pergunta
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
        .text-gray-500.mt-2 Nenhuma alternativa na pergunta atual, adicione uma com o botão acima.
      template(v-else)
        choices-container(
          :choices="question.possibleChoices"
          @update:choices="updateQuestionField($event, 'possibleChoices')"
        )
</template>

<script lang="ts">
import Vue from 'vue';
import { merge } from 'lodash';
import { Option } from 'element-ui';
import { RecordPropsDefinition } from 'vue/types/options';
import { ElFormProps } from '~/types/element-ui';
import { getDefaultQuestion } from './QuestionsContainer.vue';
import ChoicesContainer, { getDefaultChoice } from './QuestionChoicesContainer.vue';
import { SymptomQuestionnaireQuestionKind, SymptomQuestionnaireQuestionInput } from '~/types/gql';

type Data = {};
type Methods = {
  emitDelete: () => void;
  addNewChoice: () => void;
  updateQuestionField: <K extends keyof Props['question']>(value: Props['question'][K], fieldName: K) => void;
  updateQuestionPresentationOrder: (newPresentationOrder: number) => void;
};
type Computed = {
  formProps: ElFormProps<keyof SymptomQuestionnaireQuestionInput>;
  questionKindSelectOptions: Partial<Option>[];
  isQuestionMultipleChoice: boolean;
};
export type Props = {
  question: SymptomQuestionnaireQuestionInput;
  maxPresentationOrder: number;
};
export type Events = {
  'update-presentation-order': { oldPresentationOrder: number; newPresentationOrder: number };
  'delete-question': Props['question'];
  'update:question': Props['question'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { ChoicesContainer },
  props: {
    question: {
      type: Object,
      required: true,
      default: () => getDefaultQuestion(0),
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
        hideRequiredAsterisk: true,
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
          presentationOrder: [{
            type: 'number',
            required: true,
          }],
          text: [{
            type: 'string',
            required: true,
            max: 500,
            message: 'Obrigatório',
          }],
          nameForManagement: [{
            type: 'string',
            required: true,
            max: 500,
            message: 'Obrigatório',
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
  },
  methods: {
    emitDelete() {
      this.$emit<Events, 'delete-question'>('delete-question', this.question);
    },
    updateQuestionField(value, fieldName) {
      const updatedQuestion = merge({}, this.question, { [fieldName]: value });
      this.$emit<Events, 'update:question'>('update:question', updatedQuestion);
    },
    updateQuestionPresentationOrder(newPresentationOrder) {
      const eventArgs = {
        oldPresentationOrder: this.question.presentationOrder,
        newPresentationOrder,
      };
      this.$emit<Events, 'update-presentation-order'>('update-presentation-order', eventArgs);
    },
    addNewChoice() {
      const newChoice = getDefaultChoice(this.question.possibleChoices?.length || 0);
      const currentChoices = this.question.possibleChoices || [];
      const updatedQuestionChoicesArray = [...currentChoices, newChoice];

      this.updateQuestionField(updatedQuestionChoicesArray, 'possibleChoices');
    },
  },
});
</script>

<style lang="postcss" scoped>
.question-form-wrapper {
  @apply relative;

  .delete {
    @apply absolute right-0 top-0;
  }

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
