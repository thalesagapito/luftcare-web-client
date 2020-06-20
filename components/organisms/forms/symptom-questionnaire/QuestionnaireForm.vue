<template lang="pug">
  .questionnaire-form-wrapper
    el-form(v-bind="formProps" ref="form")
      .mb-7: el-form-item(label="Nome do questionário para uso interno" prop="nameForManagement")
        .form-item-helper-text
          |Esse é o nome que será mostrado apenas no painel de controle, nenhum paciente tem acesso.
        el-input(
          autofocus
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          v-model="value.nameForManagement"
        )

      .mb-7: el-form-item(label="Nome do questionário para pacientes" prop="nameForPresentation")
        .form-item-helper-text
          |Esse nome será mostrado aos pacientes,
          |é recomendado escolher um nome de fácil entendimento.
        el-input(
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          v-model="value.nameForPresentation"
        )

      el-form-item(label="Visibilidade" prop="isPublished")
        .form-item-helper-text.mb-0
          |Recomendamos criar um questionário privado inicialmente,
          |e após revisar as perguntas e alternativas torná-lo público.
        el-radio(v-model="value.isPublished" :label="false") Privado
        el-radio(v-model="value.isPublished" :label="true") Público

    .form-section-title.my-6 Perguntas do questionário
      .ml-2: el-button(type="default" size="mini" @click="addNewQuestion") Adicionar pergunta

    template(v-if="value.questions.length === 0")
      .text-gray-500.mt-2 Nenhuma pergunta no questionário, adicione uma com o botão acima.
    template(v-else)
      questions-container(:questions.sync="value.questions")
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';
import { ElFormProps } from '~/types/element-ui';
import { SymptomQuestionnaireInput } from '~/types/gql';
import QuestionsContainer, { getDefaultQuestion, removeKeysFromQuestionsChoices } from './QuestionsContainer.vue';

type Data = {};
type Methods = {
  addNewQuestion: () => void;
  emitInput: (value: Props['value']) => void;
};
type Computed = {
  formProps: ElFormProps<keyof Props['value']>;
};
export type Props = {
  value: SymptomQuestionnaireInput;
  isValid: boolean;
};
export type Events = {
  input: SymptomQuestionnaireInput; // emits keyless choices
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
      const questionsWithKeylessChoices = removeKeysFromQuestionsChoices(this.value.questions);
      const sanitizedData: Events['input'] = {
        ...updatedData,
        questions: questionsWithKeylessChoices,
      };

      this.$emit<Events, 'input'>('input', sanitizedData);
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
