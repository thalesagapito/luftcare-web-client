<template lang="pug">
  el-form.question-form-wrapper(v-bind="formProps" ref="form")
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
      el-form-item.mt-2.pb-3(prop="possibleChoices")

      choices-container(
        :choices="question.possibleChoices"
        @update:choices="updateQuestionField($event, 'possibleChoices')"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { merge, every, debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Option, Form } from 'element-ui';
import { RecordPropsDefinition } from 'vue/types/options';
import { WithIsValid, Override, Keyed } from '~/types/helpers';
import { ElFormProps } from '~/types/element-ui';
import { getDefaultChoice, KeyedChoice } from './QuestionChoiceForm.vue';
import ChoicesContainer from './QuestionChoicesContainer.vue';
import { SymptomQuestionnaireQuestionKind, SymptomQuestionnaireQuestionInput } from '~/types/gql';

export type Question = SymptomQuestionnaireQuestionInput;
type QuestionWithKeyedChoices = Override<Question, { possibleChoices?: KeyedChoice[] }>;
export type KeyedQuestion = Keyed<WithIsValid<QuestionWithKeyedChoices>>;

type DefaultQuestionGetter = (currentQuestionsLength?: number) => Props['question'];
export const getDefaultQuestion: DefaultQuestionGetter = (currentQuestionsLength) => ({
  nameForManagement: `Pergunta ${(currentQuestionsLength || 0) + 1}`,
  presentationOrder: (currentQuestionsLength || 0) + 1,
  text: '',
  kind: SymptomQuestionnaireQuestionKind.MultipleChoice,
  possibleChoices: [],
  isValid: false,
  key: uuidv4(),
});

type Data = {};
type Methods = {
  emitDelete: () => void;
  addNewChoice: () => void;
  validateFormAndEmit: () => void;
  emitUpdateQuestion:(question: Props['question']) => void;
  updateQuestionField: <K extends keyof Props['question']>(value: Props['question'][K], fieldName: K) => void;
  updateQuestionPresentationOrder: (newPresentationOrder: number) => void;
};
type Computed = {
  formProps: ElFormProps<keyof Question>;
  questionKindSelectOptions: Partial<Option>[];
  isQuestionMultipleChoice: boolean;
};
export type Props = {
  question: KeyedQuestion;
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
      default: getDefaultQuestion,
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
          possibleChoices: [
            {
              type: 'array',
              required: this.isQuestionMultipleChoice,
              validator: (rule, value: Props['question']['possibleChoices'] = [], callback) => {
                const invalidChoicesMessage = 'Preencha todas as alternativas corretamente';
                const minLengthChoicesMessage = 'Crie pelo menos duas alternativas';

                if (!this.isQuestionMultipleChoice) return callback();

                const hasMinLengthError = value.length < 2;
                if (hasMinLengthError) return callback(minLengthChoicesMessage);

                const hasInvalidChoicesError = !every(value, 'isValid');
                if (hasInvalidChoicesError) return callback(invalidChoicesMessage);

                return callback();
              },
            },
          ],
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
  watch: {
    question() {
      debounce(this.validateFormAndEmit, 50)();
    },
  },
  methods: {
    emitDelete() {
      this.$emit<Events, 'delete-question'>('delete-question', this.question);
    },
    emitUpdateQuestion(question) {
      this.$emit<Events, 'update:question'>('update:question', question);
    },
    updateQuestionField(value, fieldName) {
      const updatedQuestion = merge({}, this.question, { [fieldName]: value });
      this.emitUpdateQuestion(updatedQuestion);
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
    async validateFormAndEmit() {
      const isValid = await (this.$refs.form as Form)?.validate().catch(() => false);
      if (isValid === this.question.isValid) return;
      this.emitUpdateQuestion({ ...this.question, isValid });
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
