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
            v-model="formData.nameForManagement"
          )

        .mb-7: el-form-item(label="Nome do questionário para pacientes" prop="nameForPresentation")
          .form-item-helper-text
            |Esse nome será mostrado aos pacientes,
            |é recomendado escolher um nome de fácil entendimento.
          el-input(
            type="text"
            maxlength="500"
            placeholder="Digite aqui"
            v-model="formData.nameForPresentation"
          )

        el-form-item(label="Visibilidade" prop="isPublished")
          .form-item-helper-text.mb-0
            |Recomendamos criar um questionário privado inicialmente,
            |e após revisar as perguntas e alternativas torná-lo público.
          el-radio(v-model="formData.isPublished" :label="false") Privado
          el-radio(v-model="formData.isPublished" :label="true") Público

        .form-section-title.my-6 Perguntas do questionário
          .ml-2: el-button(type="default" size="mini" @click="addNewQuestion") Adicionar pergunta

        template(v-if="formData.questions.length === 0")
          .text-gray-500.mt-2 Nenhuma pergunta no questionário, adicione uma com o botão acima.
        template(v-else)
          question-stepper(
            v-bind="stepperProps"
            @update:activeStepNumber="activeStepNumber = $event"
            @update:questions="$set(formData, 'questions', $event)"
          )

          .question-form
            question-form(
              :question.sync="currentQuestion"
              :max-presentation-order="maxPresentationOrder"
              @update-presentation-order="updateQuestionsOrder"
            )

        el-form-item.flex.justify-end.mb-0.mt-5
          el-button(
            type="default"
            @click="$router.back"
          ) Cancelar
          el-button(
            type="primary"
            @click="validateFormAndSubmit"
          ) Criar questionário
</template>

<script lang="ts">
import Vue from 'vue';
import { find } from 'lodash';
import { Form } from 'element-ui';
import { ExecutionResult } from 'graphql';
import { ElFormProps } from '~/types/element-ui';
import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import {
  Mutation,
  SymptomQuestionnaireQuestionKind,
  MutationCreateSymptomQuestionnaireArgs,
} from '~/types/gql';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import CreateSymptomQuestionnaireMutationGQL from '~/graphql/mutations/SymptomQuestionnaires/createSymptomQuestionnaire';
import QuestionForm, { Props as QuestionProps, Events as QuestionEvents } from '~/components/organisms/questionnaires/symptom-analysis/FormQuestionForm.vue';
import QuestionStepper, { Props as StepperProps } from '~/components/organisms/questionnaires/symptom-analysis/FormQuestionStepper.vue';

type Data = {
  formData: MutationCreateSymptomQuestionnaireArgs['form'];
  activeStepNumber: number;
};
type Methods = {
  createForm: () => void;
  addNewQuestion: () => void;
  validateFormAndSubmit: () => void;
  handleFormCreationSuccess: (args: ExecutionResult<Mutation>) => void;
  updateQuestionsOrder: (args: QuestionEvents['update-presentation-order']) => void;
};
type Computed = {
  stepperProps: StepperProps;
  headerProps: HeaderProps;
  formProps: Partial<ElFormProps<keyof Data['formData']>>;
  currentQuestion: QuestionProps['question'];
  maxPresentationOrder: QuestionProps['maxPresentationOrder'];
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: 'dashboard' as RegisteredLayout,
  middleware: 'isUserAuthenticated' as RegisteredMiddleware,
  components: {
    TheHeader, ShadowedCard, QuestionStepper, QuestionForm,
  },
  data() {
    return {
      activeStepNumber: 1,
      formData: {
        nameForManagement: '',
        nameForPresentation: '',
        questions: [
          {
            nameForManagement: 'Pergunta 1',
            text: 'Texto da Pergunta 1',
            kind: SymptomQuestionnaireQuestionKind.FreeResponse,
            presentationOrder: 1,
            possibleChoices: [],
          },
        ],
        isPublished: false,
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
            message: 'O nome do questionário para pacientes é obrigatório',
          }],
          isPublished: [{ type: 'boolean', required: true }],
          questions: [{ type: 'string', required: true, max: 500 }],
        },
      };
    },
    stepperProps() {
      return {
        activeStepNumber: this.activeStepNumber,
        questions: this.formData.questions,
      };
    },
    currentQuestion: {
      get() {
        return find(
          this.formData.questions,
          ['presentationOrder', this.activeStepNumber],
        ) as Computed['currentQuestion'];
      },
      set(newQuestionValue: Computed['currentQuestion']) {
        const newFormDataQuestions = this.formData.questions.map((originalQuestion) => {
          const isCurrentQuestionTheOne = originalQuestion.presentationOrder === this.activeStepNumber;
          return isCurrentQuestionTheOne ? newQuestionValue : originalQuestion;
        });

        this.formData = {
          ...this.formData,
          questions: newFormDataQuestions,
        };
      },
    },
    maxPresentationOrder() {
      return this.formData.questions.length;
    },
  },
  methods: {
    validateFormAndSubmit() {
      (this.$refs.form as Form).validate((isValid) => {
        if (!isValid) {
          this.$notify({ title: 'Erro', type: 'error', message: 'Preencha todos os campos corretamente' });
          return;
        }

        this.createForm();
      });
    },
    async createForm() {
      const mutationArgs: MutationCreateSymptomQuestionnaireArgs = {
        form: this.formData,
      };

      const loading = this.$loading({ lock: true, text: 'Criando questionário...' });

      await this.$apollo
        .mutate({ mutation: CreateSymptomQuestionnaireMutationGQL, variables: mutationArgs })
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
          nameForManagement: `Pergunta ${this.formData?.questions?.length + 1}`,
          kind: SymptomQuestionnaireQuestionKind.MultipleChoice,
          presentationOrder: this.formData?.questions?.length + 1,
        },
      ];
    },
    updateQuestionsOrder({ oldPresentationOrder, newPresentationOrder }) {
      const questionsWithUpdatedPresentationOrders = this.formData.questions.map((question) => {
        if (question.presentationOrder === oldPresentationOrder) {
          return { ...question, presentationOrder: newPresentationOrder };
        }
        if (question.presentationOrder === newPresentationOrder) {
          return { ...question, presentationOrder: oldPresentationOrder };
        }
        return question;
      });

      this.formData.questions = questionsWithUpdatedPresentationOrders;
      this.activeStepNumber = newPresentationOrder;
    },

  },
  head: {
    titleTemplate: (base) => `${base} - Criar novo questionário`,
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
    &.mb-0 {
      @apply mb-0;
    }
  }

  .question-form {
    @apply px-6 pt-5;
  }
}
</style>
