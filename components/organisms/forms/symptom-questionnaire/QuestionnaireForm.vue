<template lang="pug">
  .questionnaire-form-wrapper
    .form-section-title Dados do questionário

    el-form(v-bind="formProps" ref="form")
      .mb-7: el-form-item(label="Nome do questionário para uso interno" prop="nameForManagement")
        .form-item-helper-text
          |Esse é o nome que será mostrado apenas no painel de controle, nenhum paciente tem acesso.
        el-input(
          autofocus
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="value.nameForManagement"
          @input="updateQuestionnaireField($event, 'nameForManagement')"
        )

      .mb-7: el-form-item(label="Nome do questionário para pacientes" prop="nameForPresentation")
        .form-item-helper-text
          |Esse nome será mostrado aos pacientes,
          |é recomendado escolher um nome de fácil entendimento.
        el-input(
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="value.nameForPresentation"
          @input="updateQuestionnaireField($event, 'nameForPresentation')"
        )

      el-form-item(label="Visibilidade" prop="isPublished")
        .form-item-helper-text.mb-0
          |Recomendamos criar um questionário privado inicialmente,
          |e após revisar as perguntas e alternativas torná-lo público.
        el-radio(
          :label="false"
          :value="value.isPublished"
          @input="updateQuestionnaireField($event, 'isPublished')"
        ) Privado
        el-radio(
          :label="true"
          :value="value.isPublished"
          @input="updateQuestionnaireField($event, 'isPublished')"
        ) Público

    .form-section-title.my-6 Perguntas do questionário
      .ml-2: el-button(type="default" size="mini" @click="addNewQuestion") Adicionar pergunta

    questions-container(
      v-if="hasAnyQuestions"
      :questions="value.questions"
      @update:questions="updateQuestionnaireField($event, 'questions')"
    )
    .text-gray-500.mt-2(v-else) Nenhuma pergunta no questionário, adicione uma com o botão acima.
</template>

<script lang="ts">
import Vue from 'vue';
import { merge } from 'lodash';
import { RecordPropsDefinition } from 'vue/types/options';
import { ElFormProps } from '~/types/element-ui';
import { SymptomQuestionnaireInput } from '~/types/gql';
import QuestionsContainer, { getDefaultQuestion, removeKeysFromQuestionsChoices } from './QuestionsContainer.vue';

type QuestionnaireKeyRemover = (questionnaire: Props['value']) => Props['value'];
export const removeKeysFromQuestionnaire: QuestionnaireKeyRemover = (questionnaire) => {
  const questionsWithKeylessChoices = removeKeysFromQuestionsChoices(questionnaire.questions);
  const keylessQuestionnaire = {
    ...questionnaire,
    questions: questionsWithKeylessChoices,
  };
  return keylessQuestionnaire;
};

type Data = {};
type Methods = {
  addNewQuestion: () => void;
  emitInput: (value: Props['value']) => void;
  updateQuestionnaireField: <K extends keyof Props['value']>(value: Props['value'][K], fieldName: K) => void;
};
type Computed = {
  hasAnyQuestions: boolean;
  formProps: ElFormProps<keyof Props['value']>;
};
export type Props = {
  value: SymptomQuestionnaireInput;
  isValid: boolean;
};
export type Events = {
  input: SymptomQuestionnaireInput; // emits keyed choices
  'update:isValid': Props['isValid'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: {
    QuestionsContainer,
  },
  props: {
    isValid: {
      type: Boolean,
      required: true,
      default: false,
    },
    value: {
      type: Object,
      required: true,
      default: () => ({
        questions: [],
        isPublished: false,
        nameForManagement: '',
        nameForPresentation: '',
      }),
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    hasAnyQuestions() {
      return this.value.questions.length > 0;
    },
    formProps() {
      return {
        hideRequiredAsterisk: true,
        model: {
          nameForManagement: this.value.nameForManagement,
          nameForPresentation: this.value.nameForPresentation,
          isPublished: this.value.isPublished,
          questions: this.value.questions,
        },
        rules: {
          nameForManagement: [{
            max: 500,
            type: 'string',
            required: true,
            message: 'O nome para uso interno é obrigatório',
          }],
          nameForPresentation: [{
            max: 500,
            type: 'string',
            required: true,
            message: 'O nome do questionário para pacientes é obrigatório',
          }],
          isPublished: [{ type: 'boolean', required: true }],
          questions: [
            // TODO ADD CUSTOM VALIDATOR HERE
            // HAVE A SYNC PROP LIKE isQuestionsValid
            // return if its true
          ],
        },
      };
    },
  },
  methods: {
    addNewQuestion() {
      const newQuestion = getDefaultQuestion(this.value.questions?.length || 0);
      this.value.questions.push(newQuestion);
    },
    emitInput(updatedData) {
      // TODO update isValid here

      this.$emit<Events, 'input'>('input', updatedData);
    },
    updateQuestionnaireField(updatedValue, fieldName) {
      const updatedQuestionnaire = merge({}, this.value, { [fieldName]: updatedValue });
      this.emitInput(updatedQuestionnaire);
    },
  },
});
</script>

<style lang="postcss" scoped>
.questionnaire-form-wrapper {
  .form-section-title {
    @apply mb-6 text-lg font-semibold text-gray-800 flex items-center;
  }

  & >>> .form-item-helper-text {
    @apply text-sm text-gray-500 leading-none mt-1 mb-2;
  }
}
</style>
