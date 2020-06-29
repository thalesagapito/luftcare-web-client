<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-5.mt-6
      questionnaire-form(
        v-model="questionnaireData"
        :is-valid.sync="isFormValid"
      )

      .form-section-footer
        el-button(type="default" @click="$router.back()") Cancelar
        el-button(
          type="primary"
          :disabled="!isFormValid"
          @click="runCreateQuestionnaireMutation"
        ) Criar questionário
</template>

<script lang="ts">
import Vue from 'vue';

import { RegisteredLayout, RegisteredMiddleware } from '@/enums';
import { MutationUpdateSymptomQuestionnaireArgs, Query } from '@/types/gql';
import UpdateQuestionnaireMutation from '@/graphql/mutations/SymptomQuestionnaires/updateQuestionnaire';
import GetQuestionnaireQuery from '@/graphql/queries/SymptomQuestionnaires/getSymptomQuestionnaire';

import ShadowedCard from '@/components/atoms/ShadowedCard.vue';
import TheHeader, { Props as HeaderProps } from '@/components/molecules/HeaderWithBreadcrumbs.vue';
import QuestionnaireForm, { Props as FormProps, unkeyQuestionnaire } from '@/components/organisms/forms/symptom-questionnaire/QuestionnaireForm.vue';

type Data = {
  isFormValid: boolean;
  questionnaireData: MutationUpdateSymptomQuestionnaireArgs['questionnaire'] & FormProps['value'];
};
type Methods = {
  runCreateQuestionnaireMutation: () => void;
  handleFormCreationSuccess: () => void;
  keyQuestionsAndChoices: (questionnaire: Query['symptomQuestionnaire']) => FormProps['value'];
};
type Computed = {
  headerProps: HeaderProps;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard, QuestionnaireForm },
  data() {
    return {
      isFormValid: false,
      questionnaireData: {
        nameForManagement: '',
        nameForPresentation: '',
        isPublished: false,
        questions: [],
      },
    };
  },
  apollo: {
    questionnaireData: {
      query: GetQuestionnaireQuery,
      variables() {
        return { id: this.$route.params.id };
      },
      update({ symptomQuestionnaire }: Query) {
        return this.keyQuestionsAndChoices(symptomQuestionnaire);
      },
    },
  },
  computed: {
    headerProps() {
      return {
        title: 'Editar questionário',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Questionários', to: '/dashboard/questionarios' },
            { label: 'Editar', to: '' },
          ],
        },
      };
    },
  },
  methods: {
    async runCreateQuestionnaireMutation() {
      const mutationArgs: MutationUpdateSymptomQuestionnaireArgs = {
        idSharedBetweenVersions: '1',
        questionnaire: unkeyQuestionnaire(this.questionnaireData),
      };
      const loading = this.$loading({ lock: true, text: 'Criando questionário...' });

      await this.$apollo
        .mutate({ mutation: UpdateQuestionnaireMutation, variables: mutationArgs })
        .then(this.handleFormCreationSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    handleFormCreationSuccess() {
      this.$notify({ title: 'Sucesso', type: 'success', message: 'Formulário criado com sucesso' });
      this.$router.push('/dashboard/questionarios');
    },
    keyQuestionsAndChoices(questionnaire) {
      console.log(questionnaire);
      return {
        nameForManagement: '', nameForPresentation: '', questions: [], isPublished: false,
      };
    },
  },

});
</script>

<style lang="postcss" scoped>
.dashboard-page-wrapper {
  .form-section-footer {
    @apply flex justify-end mb-0 mt-5;
  }
}
</style>
