<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-5.mt-6
      questionnaire-form(
        v-model="questionnaireData"
        :is-valid.sync="isFormValid"
      )

      .form-section-footer
        el-button(type="default" @click="$router.push('/dashboard/questionarios')") Cancelar
        el-button(
          type="primary"
          :disabled="!isFormValid"
          @click="runCreateQuestionnaireMutation"
        ) Criar questionário
</template>

<script lang="ts">
import Vue from 'vue';

import { RegisteredLayout, RegisteredMiddleware } from '@/enums';
import { MutationCreateSymptomQuestionnaireArgs } from '@/types/gql';
import CreateSymptomQuestionnaireMutation from '@/graphql/mutations/SymptomQuestionnaires/createSymptomQuestionnaire';

import ShadowedCard from '@/components/atoms/ShadowedCard.vue';
import TheHeader, { Props as HeaderProps } from '@/components/molecules/HeaderWithBreadcrumbs.vue';
import { unkeyQuestionnaire } from '@/components/organisms/forms/symptom-questionnaire/vueKeyManipulationFunctions';
import QuestionnaireForm, { Props as FormProps } from '@/components/organisms/forms/symptom-questionnaire/QuestionnaireForm.vue';

type Data = {
  isFormValid: boolean;
  questionnaireData: FormProps['value'];
};
type Methods = {
  runCreateQuestionnaireMutation: () => void;
  handleFormCreationSuccess: () => void;
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
  computed: {
    headerProps() {
      return {
        title: 'Criar novo questionário',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Questionários', to: '/dashboard/questionarios' },
            { label: 'Criar', to: '' },
          ],
        },
      };
    },
  },
  methods: {
    async runCreateQuestionnaireMutation() {
      const mutationArgs: MutationCreateSymptomQuestionnaireArgs = {
        questionnaire: unkeyQuestionnaire(this.questionnaireData),
      };
      const loading = this.$loading({ lock: true, text: 'Criando questionário...' });

      await this.$apollo
        .mutate({ mutation: CreateSymptomQuestionnaireMutation, variables: mutationArgs })
        .then(this.handleFormCreationSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    handleFormCreationSuccess() {
      this.$notify({ title: 'Sucesso', type: 'success', message: 'Questionário criado com sucesso' });
      this.$router.push({ name: 'dashboard-questionarios', params: { refetch: '1' } });
    },
  },
  head: {
    titleTemplate: (base) => `${base} - Criar questionário`,
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
