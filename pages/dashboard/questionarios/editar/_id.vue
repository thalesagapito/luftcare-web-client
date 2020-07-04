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
        ) Atualizar questionário
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import isUUID from 'validator/lib/isUUID';

import { Nullable } from '@/types/helpers';
import { RegisteredLayout, RegisteredMiddleware } from '@/enums';
import { MutationUpdateSymptomQuestionnaireArgs, Query } from '@/types/gql';
import smartQueryErrorHandler from '@/errorHandling/apollo/smartQueryErrorHandler';
import GetQuestionnaireQuery from '@/graphql/queries/SymptomQuestionnaires/getSymptomQuestionnaire';
import UpdateQuestionnaireMutation from '@/graphql/mutations/SymptomQuestionnaires/updateQuestionnaire';

import ShadowedCard from '@/components/atoms/ShadowedCard.vue';
import TheHeader, { Props as HeaderProps } from '@/components/molecules/HeaderWithBreadcrumbs.vue';
import { mapQuestionnaireTypeToInput } from '@/components/organisms/forms/symptom-questionnaire/typeInputMapperFunctions';
import QuestionnaireForm, { Props as FormProps } from '@/components/organisms/forms/symptom-questionnaire/QuestionnaireForm.vue';
import { keyQuestionnaire, unkeyQuestionnaire } from '@/components/organisms/forms/symptom-questionnaire/vueKeyManipulationFunctions';

type Data = {
  isFormValid: boolean;
  questionnaireData: FormProps['value'];
  idSharedBetweenVersions: Nullable<string>;
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
      idSharedBetweenVersions: undefined,
      questionnaireData: {
        questions: [],
        isPublished: false,
        nameForManagement: '',
        nameForPresentation: '',
      },
    };
  },
  apollo: {
    questionnaireData: {
      query: GetQuestionnaireQuery,
      error: debounce(smartQueryErrorHandler, 10),
      variables() { return { id: this.$route.params.id }; },
      update({ symptomQuestionnaire }: Partial<Query>) {
        if (!symptomQuestionnaire) return this.$router.push('/dashboard/questionarios');
        this.idSharedBetweenVersions = symptomQuestionnaire.idSharedBetweenVersions;
        const symptomQuestionnaireInput = mapQuestionnaireTypeToInput(symptomQuestionnaire);
        return keyQuestionnaire(symptomQuestionnaireInput);
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
      if (!this.questionnaireData || !this.idSharedBetweenVersions) return;
      const mutationArgs: MutationUpdateSymptomQuestionnaireArgs = {
        idSharedBetweenVersions: this.idSharedBetweenVersions,
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
      this.$notify({ title: 'Sucesso', type: 'success', message: 'Questionário alterado com sucesso' });
      this.$router.push({ name: 'dashboard-questionarios', params: { refetch: '1' } });
    },
  },
  validate({ params }) {
    const { id } = params;
    if (!id) throw new Error('Identificador do questionário ausente na url');
    if (!isUUID(id)) throw new Error('Identificador do questionário inválido');
    return true;
  },
  head: {
    titleTemplate: (base) => `${base} - Editar questionário`,
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