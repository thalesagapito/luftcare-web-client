<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-5.mt-6
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
            v-model="questionnaireData.nameForManagement"
          )

        .mb-7: el-form-item(label="Nome do questionário para pacientes" prop="nameForPresentation")
          .form-item-helper-text
            |Esse nome será mostrado aos pacientes,
            |é recomendado escolher um nome de fácil entendimento.
          el-input(
            type="text"
            maxlength="500"
            placeholder="Digite aqui"
            v-model="questionnaireData.nameForPresentation"
          )

        el-form-item(label="Visibilidade" prop="isPublished")
          .form-item-helper-text.mb-0
            |Recomendamos criar um questionário privado inicialmente,
            |e após revisar as perguntas e alternativas torná-lo público.
          el-radio(v-model="questionnaireData.isPublished" :label="false") Privado
          el-radio(v-model="questionnaireData.isPublished" :label="true") Público

      .form-section-title.my-6 Perguntas do questionário
        .ml-2: el-button(type="default" size="mini" @click="addNewQuestion") Adicionar pergunta

      template(v-if="questionnaireData.questions.length === 0")
        .text-gray-500.mt-2 Nenhuma pergunta no questionário, adicione uma com o botão acima.
      template(v-else)
        questions-container(:questions.sync="questionnaireData.questions")

      .form-section-footer
        el-button(type="default" @click="$router.back()") Cancelar
        el-button(type="primary" @click="validateFormAndSubmit") Criar questionário
</template>

<script lang="ts">
import Vue from 'vue';
import { Form } from 'element-ui';
import { ExecutionResult } from 'graphql';
import { ElFormProps } from '~/types/element-ui';
import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import { Mutation, MutationCreateSymptomQuestionnaireArgs } from '~/types/gql';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import CreateSymptomQuestionnaireMutationGQL from '~/graphql/mutations/SymptomQuestionnaires/createSymptomQuestionnaire';
import QuestionsContainer, { getDefaultQuestion } from '~/components/organisms/forms/symptom-questionnaire/QuestionsContainer.vue';

type Data = {
  questionnaireData: MutationCreateSymptomQuestionnaireArgs['questionnaire'];
};
type Methods = {
  addNewQuestion: () => void;
  runCreateFormMutation: () => void;
  validateFormAndSubmit: () => void;
  handleFormCreationSuccess: (args: ExecutionResult<Mutation>) => void;
};
type Computed = {
  headerProps: HeaderProps;
  formProps: ElFormProps<keyof Data['questionnaireData']>;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: 'dashboard' as RegisteredLayout,
  middleware: 'isUserAuthenticated' as RegisteredMiddleware,
  components: { TheHeader, ShadowedCard, QuestionsContainer },
  data() {
    return {
      questionnaireData: {
        nameForManagement: '',
        nameForPresentation: '',
        isPublished: false,
        questions: [],
      },
    };
  },
  computed: {
    headerProps() {
      return {
        title: 'Criar novo questionário',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Questionários', to: '/dashboard/questionarios' },
            { label: 'Criar', to: '/dashboard/questionarios/novo' },
          ],
        },
      };
    },
    formProps() {
      return {
        model: {
          nameForManagement: this.questionnaireData.nameForManagement,
          nameForPresentation: this.questionnaireData.nameForPresentation,
          isPublished: this.questionnaireData.isPublished,
          questions: this.questionnaireData.questions,
        },
        rules: {
          nameForManagement: [{
            max: 5,
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
      const newQuestion = getDefaultQuestion(this.questionnaireData.questions?.length || 0);
      this.questionnaireData.questions.push(newQuestion);
    },
    async runCreateFormMutation() {
      const mutationArgs: MutationCreateSymptomQuestionnaireArgs = { questionnaire: this.questionnaireData };
      const loading = this.$loading({ lock: true, text: 'Criando questionário...' });

      await this.$apollo
        .mutate({ mutation: CreateSymptomQuestionnaireMutationGQL, variables: mutationArgs })
        .then(this.handleFormCreationSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    validateFormAndSubmit() {
      (this.$refs.form as Form).validate((isValid) => {
        if (!isValid) {
          this.$notify({ title: 'Erro', type: 'error', message: 'Preencha todos os campos corretamente' });
          return;
        }

        this.runCreateFormMutation();
      });
    },
    handleFormCreationSuccess({ data }) {
      console.log(data);
    },
  },

});
</script>

<style lang="postcss" scoped>
.dashboard-page-wrapper {
  .form-section-title {
    @apply mb-6 text-lg font-semibold text-gray-800 flex items-center;
  }

  & >>> .form-item-helper-text {
    @apply text-sm text-gray-500 leading-none mt-1 mb-2;
  }

  .form-section-footer {
    @apply flex justify-end mb-0 mt-5;
  }
}
</style>
