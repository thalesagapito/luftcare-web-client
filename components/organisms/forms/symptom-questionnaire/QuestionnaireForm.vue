<template lang="pug">
  .questionnaire-form-wrapper
    .form-section-title.mb-6 Dados do questionário

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
          @input="updateQuestionnaireField('nameForManagement', $event)"
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
          @input="updateQuestionnaireField('nameForPresentation', $event)"
        )

      el-form-item(label="Visibilidade" prop="isPublished")
        .form-item-helper-text.mb-0
          |Recomendamos criar um questionário privado inicialmente,
          |e após revisar as perguntas e alternativas torná-lo público.
        el-radio(
          :label="false"
          :value="value.isPublished"
          @input="updateQuestionnaireField('isPublished', $event)"
        ) Privado
        el-radio(
          :label="true"
          :value="value.isPublished"
          @input="updateQuestionnaireField('isPublished', $event)"
        ) Público


      .form-section-title.mt-4 Perguntas do questionário
        .ml-2: el-button(type="default" size="mini" @click="addNewQuestion") Adicionar pergunta
      el-form-item.pb-6(prop="questions")

      questions-container(
        v-if="hasAnyQuestions"
        :questions="value.questions"
        @update:questions="updateQuestionnaireField($event, 'questions')"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { every } from 'lodash';
import { RecordPropsDefinition } from 'vue/types/options';
import { Form } from 'element-ui';
import { ElFormProps } from '@/types/element-ui';
import { SymptomQuestionnaireInput } from '@/types/gql';
import { Override, UpdateFieldWithValueFunction } from '@/types/helpers';
import QuestionsContainer, { unkeyQuestionsChoices } from './QuestionsContainer.vue';
import { getDefaultQuestion, KeyedQuestion } from './QuestionForm.vue';

export type Questionnaire = SymptomQuestionnaireInput;
export type QuestionnaireWithKeyedChildren = Override<Questionnaire, { questions: KeyedQuestion[] }>;

type QuestionnaireKeyRemover = (questionnaire: Props['value']) => Questionnaire;
export const unkeyQuestionnaire: QuestionnaireKeyRemover = (questionnaire) => {
  const questionsWithKeylessChoices = unkeyQuestionsChoices(questionnaire.questions);
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
  updateQuestionnaireField: UpdateFieldWithValueFunction<Props['value']>;
};
type Computed = {
  hasAnyQuestions: boolean;
  formProps: ElFormProps<keyof Props['value']>;
};
export type Props = {
  value: QuestionnaireWithKeyedChildren;
  isValid: boolean;
};
export type Events = {
  input: Props['value'];
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
            message: 'Obrigatório',
          }],
          nameForPresentation: [{
            max: 500,
            type: 'string',
            required: true,
            message: 'Obrigatório',
          }],
          isPublished: [{ type: 'boolean', required: true }],
          questions: [
            {
              type: 'array',
              required: true,
              validator: (rule, value: Props['value']['questions'] = [], callback) => {
                const invalidQuestionsMessage = 'Preencha todas as perguntas corretamente';
                const minLengthQuestionsMessage = 'Crie pelo menos uma pergunta';

                const hasMinLengthError = value.length < 1;
                if (hasMinLengthError) return callback(minLengthQuestionsMessage);

                const hasInvalidQuestionsError = !every(value, 'isValid');
                if (hasInvalidQuestionsError) return callback(invalidQuestionsMessage);

                return callback();
              },
            },
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
      this.$emit<Events, 'input'>('input', updatedData);
      this.$nextTick(() => (this.$refs.form as Form).validate((newIsValid) => {
        if (newIsValid !== this.isValid) {
          this.$emit<Events, 'update:isValid'>('update:isValid', newIsValid);
        }
      }));
    },
    updateQuestionnaireField(field, value) {
      const updatedQuestionnaire = { ...this.value, [field]: value };
      this.emitInput(updatedQuestionnaire);
    },
  },
});
</script>

<style lang="postcss" scoped>
.questionnaire-form-wrapper {
  .form-section-title {
    @apply text-lg font-semibold text-gray-800 flex items-center;
  }

  & >>> .form-item-helper-text {
    @apply text-sm text-gray-500 leading-none mt-1 mb-2;
  }
}
</style>
