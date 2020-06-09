<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-5.mt-6
      .form-section-title Dados do formulário

      el-form(v-bind="formProps" ref="form")
        .mb-7: el-form-item(label="Nome para uso interno do formulário" prop="nameForManagement" )
          .form-item-helper-text
            |Esse é o nome que será mostrado apenas no painel de controle, nenhum paciente tem acesso.
          el-input(
            autofocus
            type="text"
            maxlength="500"
            placeholder="Digite aqui"
            v-model="formData.nameForManagement"
          )

        .mb-7: el-form-item(label="Nome do formulário para pacientes" prop="nameForPresentation")
          .form-item-helper-text
            |Esse nome será mostrado aos pacientes, é recomendado escolher um nome de fácil entendimento.
          el-input(
            type="text"
            maxlength="500"
            placeholder="Digite aqui"
            v-model="formData.nameForPresentation"
          )

        el-form-item(label="Visibilidade" prop="isPublished")
          .form-item-helper-text.mb-0
            |Recomendamos criar um formulário privado inicialmente,
            |e após revisar as perguntas e alternativas torná-lo público.
          el-radio(v-model="formData.isPublished" :label="false") Privado
          el-radio(v-model="formData.isPublished" :label="true") Público

        .form-section-title.my-6 Perguntas do formulário
          .ml-2: el-button(type="default" size="mini" @click="addNewQuestion") Adicionar pergunta

        el-steps.questions-stepper(v-bind="stepperProps")
          el-step(
            v-for="question in questionSteps"
            :key="question.presentationOrder"
            v-bind="question"
            @click="test"
          )
        el-form-item.flex.justify-end.mb-0.mt-5
          el-button(
            type="default"
            @click="cancelAndGoBack"
          ) Cancelar
          el-button(
            type="primary"
            @click="validateFormAndSubmit"
          ) Criar formulário
</template>

<script lang="ts">
import Vue from 'vue';
import { Form, Steps, Step } from 'element-ui';
import { ExecutionResult } from 'graphql';
import { ElFormProps } from '~/types/element-ui';
import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import {
  Mutation,
  SymptomAnalysisFormQuestionKind,
  MutationCreateSymptomAnalysisFormArgs,
  CreateSymptomAnalysisFormQuestionInput,
} from '~/types/gql';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import CreateSymptomAnalysisFormMutationGQL from '~/graphql/mutations/SymptomAnalysisForms/createSymptomAnalysisForm';

type QuestionStep = Partial<Step> & CreateSymptomAnalysisFormQuestionInput;

type Data = {
  formData: MutationCreateSymptomAnalysisFormArgs['form'];
  currentQuestionNumber: number;
};
type Methods = {
  test: () => void;
  createForm: () => void;
  addNewQuestion: () => void;
  cancelAndGoBack: () => void;
  validateFormAndSubmit: () => void;
  handleFormCreationSuccess: (args: ExecutionResult<Mutation>) => void;
};
type Computed = {
  stepperProps: Partial<Steps>;
  headerProps: HeaderProps;
  formProps: Partial<ElFormProps<keyof Data['formData']>>;
  questionSteps: Partial<Step>[];
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: 'dashboard' as RegisteredLayout,
  middleware: 'isUserAuthenticated' as RegisteredMiddleware,
  components: { TheHeader, ShadowedCard },
  data() {
    return {
      currentQuestionNumber: 1,
      formData: {
        nameForManagement: '',
        nameForPresentation: '',
        questions: [],
        isPublished: false,
      },
    };
  },
  computed: {
    headerProps() {
      return {
        title: 'Criar novo formulário',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Formulários', to: '/dashboard/formularios' },
            { label: 'Criar', to: '/dashboard/formularios/novo' },
          ],
        },
      };
    },
    formProps() {
      return {
        model: {
          nameForManagement: this.formData.nameForManagement,
          nameForPresentation: this.formData.nameForPresentation,
          isPublished: this.formData.isPublished,
          questions: this.formData.questions,
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
            message: 'O nome do formulário para pacientes é obrigatório',
          }],
          isPublished: [{ type: 'boolean', required: true }],
          questions: [{ type: 'string', required: true, max: 500 }],
        },
      };
    },
    stepperProps() {
      return {
        simple: true,
        active: 1,
      };
    },
    questionSteps() {
      return this.formData?.questions?.map((question) => ({
        icon: '_',
        title: question.nameForManagement,
        status: this.currentQuestionNumber === question.presentationOrder ? 'finish' : 'wait',
      }) as Computed['questionSteps'][0]);
    },
  },
  methods: {
    test() {
      alert('aaa');
    },
    validateFormAndSubmit() {
      (this.$refs.form as Form).validate((isValid) => {
        if (!isValid) {
          this.$notify({ title: 'Erro', type: 'error', message: 'Preencha todos os campos corretamente' });
          return;
        }

        this.createForm();
      });
    },
    cancelAndGoBack() {
      this.$router.back();
    },
    async createForm() {
      const mutationArgs: MutationCreateSymptomAnalysisFormArgs = {
        form: this.formData,
      };

      const loading = this.$loading({ lock: true, text: 'Criando formulário...' });

      await this.$apollo
        .mutate({ mutation: CreateSymptomAnalysisFormMutationGQL, variables: mutationArgs })
        .then(this.handleFormCreationSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    handleFormCreationSuccess({ data }) {
      console.log(data);
    },
    addNewQuestion() {
      this.formData.questions = [
        ...this.formData.questions,
        {
          text: '',
          possibleChoices: [],
          nameForManagement: 'Nova pergunta',
          kind: SymptomAnalysisFormQuestionKind.MultipleChoice,
          presentationOrder: this.formData.questions.length + 1,
        },
      ];
    },
  },
  head: {
    titleTemplate: (base) => `${base} - Criar novo formulário`,
  },
});
</script>

<style lang="postcss" scoped>
.dashboard-page-wrapper {
  .form-section-title {
    @apply mb-6 text-lg font-semibold text-gray-800 flex items-center;
  }

  .form-item-helper-text {
    @apply text-sm text-gray-500 leading-none mt-1 mb-2;
    &.mb-0 {
      @apply mb-0;
    }
  }

  .questions-stepper {
    @apply rounded-lg px-4;

    .el-step.is-simple >>> .el-step__head {
      @apply hidden;
    }
    .el-step.is-simple >>> .el-step__title {
      @apply break-normal text-center text-base;
      max-width: 70%;
    }
  }
}
</style>
