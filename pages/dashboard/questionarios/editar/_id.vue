<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-5.mt-4
      questionnaire-form(
        v-model="questionnaireData"
        :is-valid.sync="isFormValid"
      )

      .form-section-footer
        el-button(type="default" @click="goToQuestionnaires") Cancelar
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

import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import { MutationUpdateQuestionnaireArgs, Query } from '~/types/gql';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';
import GetQuestionnaireQuery from '~/graphql/queries/Questionnaires/getQuestionnaire';
import UpdateQuestionnaireMutation from '~/graphql/mutations/Questionnaires/updateQuestionnaire';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import { mapQuestionnaireTypeToInput } from '~/components/organisms/forms/questionnaire/typeInputMapperFunctions';
import QuestionnaireForm, { Props as FormProps } from '~/components/organisms/forms/questionnaire/QuestionnaireForm.vue';
import { keyQuestionnaire, unkeyQuestionnaire } from '~/components/organisms/forms/questionnaire/vueKeyManipulationFunctions';
import { QUESTIONNAIRES_PATH } from '../index.vue';

export const EDIT_QUESTIONNAIRE_PATH = '/dashboard/questionarios/editar/:id';

type Data = {
  isFormValid: boolean;
  questionnaireData?: FormProps['value'];
  id?: string;
};
type Methods = {
  goToQuestionnaires: (refetch?: boolean) => void;
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
      isFormValid: true,
      id: undefined,
      questionnaireData: {
        questions: [],
        scoreRanges: [],
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
      update({ questionnaire }: Partial<Query>): Data['questionnaireData'] {
        if (!questionnaire) {
          this.$router.push('/dashboard/questionarios');
          return undefined;
        }
        this.id = questionnaire.id;
        const questionnaireInput = mapQuestionnaireTypeToInput(questionnaire);
        return keyQuestionnaire(questionnaireInput);
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
      if (!this.questionnaireData || !this.id) return;
      const mutationArgs: MutationUpdateQuestionnaireArgs = {
        id: this.id,
        questionnaire: unkeyQuestionnaire(this.questionnaireData),
      };
      const loading = this.$loading({ lock: true, text: 'Salvando questionário...' });

      await this.$apollo
        .mutate({ mutation: UpdateQuestionnaireMutation, variables: mutationArgs })
        .then(this.handleFormCreationSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    handleFormCreationSuccess() {
      this.$notify({ title: 'Sucesso', type: 'success', message: 'Questionário alterado com sucesso' });
      this.goToQuestionnaires(true);
    },
    goToQuestionnaires(refetch) {
      const path = QUESTIONNAIRES_PATH;
      if (refetch) {
        const query = { refetch: '1' };
        this.$router.push({ path, query });
        return;
      }
      this.$router.push(path);
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
