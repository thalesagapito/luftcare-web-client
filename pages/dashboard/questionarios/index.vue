<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
      el-button(type="default" plain @click="refetchQuestionnaires") Atualizar
      el-button(type="primary" @click="goToNewQuestionnaire") Criar novo questionário
    shadowed-card.mt-7
      questionnaires-table(
        v-bind="questionnairesTableProps"
        @update-sort="updateQuestionnairesQueryArgs('orderBy', $event)"
        @update-page-size="updateQuestionnairesQueryArgs('resultsPerPage', $event)"
        @update-current-page="updateQuestionnairesQueryArgs('pageNumber', $event)"
      )
        el-table-column(
          label="Status"
          align="center"
          width="100"
        )
          template(slot-scope="{ row }")
            el-tag(v-if="row.isPublished" size="small") Público
            el-tag.opacity-50(v-else size="small") Privado
        el-table-column(
          fixed="right"
          label="Ações"
          align="right"
          width="235"
        )
          .action-buttons(slot-scope="{ row }")
            el-button(round size="mini" type="text" @click="handleEdit(row)") Editar
            el-popconfirm(
              title="Remover o questionário?"
              confirmButtonText="Sim, remover"
              cancelButtonText="Cancelar"
              hide-icon
              @onConfirm="handleDelete(row)"
            )
              el-button(round size="mini" type="text" slot="reference") Remover
            el-dropdown(:show-timeout="100" @command="handleDropdownClick(row, $event)")
              el-button(plain round size="mini" icon="el-icon-more-outline")
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(v-if="row.isPublished" command="unpublish") Tornar privado
                el-dropdown-item(v-else command="publish") Publicar
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { ExecutionResult } from 'graphql';

import { replaceParamsInPath } from '~/helpers/routing';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import { UpdateFieldWithValueFunction, MutationResponseHandler } from '~/types/helpers';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';
import { Query, CurrentQuestionnairesQuery, QueryQuestionnairesArgs } from '~/types/gql';
import QuestionnairesQueryGQL from '~/graphql/queries/Questionnaires/currentQuestionnaires';
import DeleteQuestionnaireMutation from '~/graphql/mutations/Questionnaires/deleteQuestionnaire';
import ChangePublishStatusMutation from '~/graphql/mutations/Questionnaires/changeQuestionnairePublishStatus';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { NEW_QUESTIONNAIRE_PATH } from '~/pages/dashboard/questionarios/novo.vue';
import { EDIT_QUESTIONNAIRE_PATH } from '~/pages/dashboard/questionarios/editar/_id.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import QuestionnairesTable, { Props as TableProps } from '~/components/molecules/tables/TableOrderablePaginated.vue';

export const QUESTIONNAIRES_PATH = '/dashboard/questionarios';

type Questionnaire = Query['questionnaires']['results'][0];

type Data = {
  questionnaires?: ExecutionResult<Query['questionnaires']>['data']
  questionnairesQueryArgs: QueryQuestionnairesArgs;
  isQuestionnairesTableLoading: 0;
};
type Methods = {
  refetchQuestionnaires: () => void;
  goToNewQuestionnaire: () => void;
  handleEdit: (questionnaire: Questionnaire) => void;
  handleDelete: (questionnaire: Questionnaire) => void;
  updateQuestionnairesQueryArgs: UpdateFieldWithValueFunction<Data['questionnairesQueryArgs']>;
  handlePublishStatusChangeSuccess: MutationResponseHandler['Success'];
  handleDeleteSuccess: MutationResponseHandler['Success'];
  changePublishStatus: (id: string, isPublished: boolean) => void;
  handleDropdownClick: (Questionnaire: Questionnaire, command: string) => void;
};
type Computed = {
  headerProps: HeaderProps;
  questionnairesTableProps: TableProps;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard, QuestionnairesTable },
  data() {
    return {
      isQuestionnairesTableLoading: 0,
      questionnaires: undefined,
      questionnairesQueryArgs: {
        isPublished: undefined,
        pageNumber: undefined,
        resultsPerPage: 10,
        orderBy: [],
        nameForManagement: undefined,
      },
    };
  },
  apollo: {
    questionnaires: {
      query: QuestionnairesQueryGQL,
      loadingKey: 'isQuestionnairesTableLoading',
      error: debounce(smartQueryErrorHandler, 10),
      update: ({ questionnaires }: CurrentQuestionnairesQuery) => questionnaires,
      variables() { return this.questionnairesQueryArgs; },
    },
  },
  computed: {
    headerProps() {
      return {
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Questionários', to: '/dashboard/questionarios' },
          ],
        },
        title: 'Listar Questionários',
      };
    },
    questionnairesTableProps() {
      return {
        tableProps: {
          stripe: true,
          border: true,
          isLoading: this.isQuestionnairesTableLoading,
          data: this.questionnaires?.results,
        },
        tablePaginationProps: {
          total: this.questionnaires?.totalResultsCount,
          pageSize: this.questionnairesQueryArgs.resultsPerPage || 10,
          currentPage: this.questionnairesQueryArgs.pageNumber || 1,
          layout: 'total, sizes, ->, prev, pager, next',
          pageSizes: [5, 10, 15, 20, 25],
        },
        tableColumns: [
          {
            id: 1, label: 'Nome', prop: 'nameForManagement', sortable: 'custom',
          },
          {
            id: 2, label: 'Nome para pacientes', prop: 'nameForPresentation', sortable: 'custom',
          },
          {
            id: 3, label: 'Versão atual', prop: 'version', sortable: 'custom',
          },
        ],
      };
    },
  },
  mounted() {
    if (this.$route.query.refetch) this.refetchQuestionnaires();
  },
  methods: {
    refetchQuestionnaires() {
      this.$apollo.queries.questionnaires?.refetch();
    },
    updateQuestionnairesQueryArgs(field, value) {
      this.questionnairesQueryArgs = { ...this.questionnairesQueryArgs, [field]: value };
    },
    goToNewQuestionnaire() {
      this.$router.push(NEW_QUESTIONNAIRE_PATH);
    },
    handleEdit({ id }) {
      const path = replaceParamsInPath(EDIT_QUESTIONNAIRE_PATH, { id });
      this.$router.push(path);
    },
    handleDelete({ id }) {
      this.$apollo
        .mutate({
          mutation: DeleteQuestionnaireMutation,
          variables: { id },
        })
        .then(this.handleDeleteSuccess)
        .catch(this.$clientErrorHandler);
    },
    handleDeleteSuccess({ data }) {
      this.$notify({
        title: 'Sucesso',
        message: data?.deleteQuestionnaire.userFriendlyMessage || '',
        type: 'success',
      });
      this.refetchQuestionnaires();
    },
    changePublishStatus(id, isPublished) {
      this.$apollo
        .mutate({
          mutation: ChangePublishStatusMutation,
          variables: { id, isPublished },
        })
        .then(this.handlePublishStatusChangeSuccess)
        .catch(this.$clientErrorHandler);
    },
    handlePublishStatusChangeSuccess({ data }) {
      this.$notify({
        title: 'Sucesso',
        message: data?.changeQuestionnairePublishStatus.userFriendlyMessage || '',
        type: 'success',
      });
      this.refetchQuestionnaires();
    },
    handleDropdownClick(questionnaire, command) {
      switch (command) {
        case 'publish': this.changePublishStatus(questionnaire.id, true);
          break;
        case 'unpublish': this.changePublishStatus(questionnaire.id, false);
          break;
        default:
          break;
      }
    },
  },
  head: { titleTemplate: (base) => `${base} - Listar questionários cadastrados` },
});
</script>

<style lang="postcss" scoped>
.action-buttons {
  @apply py-1;

  .el-button {
    @apply mx-0;

    &:last-of-type {
      @apply ml-1;
    }
  }
}
</style>
