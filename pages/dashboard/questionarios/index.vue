<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
      el-button(type="default" plain @click="refetchQuestionnaires") Atualizar
      el-button(type="primary" @click="$router.push('questionarios/novo')") Criar novo questionário
    shadowed-card.mt-7
      questionnaires-table(
        v-bind="questionnairesTableProps"
        @update-sort="updateQuestionnairesFilters('orderBy', $event)"
        @update-page-size="updateQuestionnairesFilters('resultsPerPage', $event)"
        @update-current-page="updateQuestionnairesFilters('pageNumber', $event)"
      )
        el-table-column(
          label="Status"
          align="center"
          width="100"
        )
          template(slot-scope="{ row }")
            el-tag(v-if="row.isPublished" size="small") Público
            el-tag(v-else size="small" type="info") Privado
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

import { RegisteredLayout, RegisteredMiddleware } from '@/enums';
import { Query, QuerySymptomQuestionnairesArgs } from '@/types/gql';
import { UpdateFieldWithValueFunction, MutationResponseHandler } from '@/types/helpers';
import smartQueryErrorHandler from '@/errorHandling/apollo/smartQueryErrorHandler';
import QuestionnairesQuery from '@/graphql/queries/SymptomQuestionnaires/currentSymptomQuestionnaires';
import ChangePublishStatusMutation from '@/graphql/mutations/SymptomQuestionnaires/changeQuestionnairePublishStatus';

import ShadowedCard from '@/components/atoms/ShadowedCard.vue';
import TheHeader, { Props as HeaderProps } from '@/components/molecules/HeaderWithBreadcrumbs.vue';
import QuestionnairesTable, { Props as TableProps } from '@/components/molecules/tables/TableOrderablePaginated.vue';

type Questionnaire = Query['symptomQuestionnaires']['results'][0];

type Data = {
  questionnaires?: ExecutionResult<Query['symptomQuestionnaires']>['data']
  questionnairesFilters: QuerySymptomQuestionnairesArgs;
  isQuestionnairesTableLoading: 0;
};
type Methods = {
  refetchQuestionnaires: () => void;
  handleEdit: (questionnaire: Questionnaire) => void;
  handleDelete: (questionnaire: Questionnaire) => void;
  updateQuestionnairesFilters: UpdateFieldWithValueFunction<Data['questionnairesFilters']>;
  handlePublishStatusChangeSuccess: MutationResponseHandler['Success'];
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
      questionnairesFilters: {
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
      query: QuestionnairesQuery,
      loadingKey: 'isQuestionnairesTableLoading',
      error: debounce(smartQueryErrorHandler, 10),
      update: ({ symptomQuestionnaires }) => symptomQuestionnaires,
      variables() { return this.questionnairesFilters; },
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
          pageSize: this.questionnairesFilters.resultsPerPage || 10,
          currentPage: this.questionnairesFilters.pageNumber || 1,
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
    if (this.$route.params.refetch) this.refetchQuestionnaires();
  },
  methods: {
    refetchQuestionnaires() {
      this.$apollo.queries.questionnaires?.refetch();
    },
    updateQuestionnairesFilters(field, value) {
      this.questionnairesFilters = { ...this.questionnairesFilters, [field]: value };
    },
    handleEdit({ id }) {
      this.$router.push({ name: 'dashboard-questionarios-editar-id', params: { id } });
    },
    handleDelete() {
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
        message: data?.changeSymptomQuestionnairePublishStatus.userFriendlyMessage || '',
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
  head: {
    titleTemplate: (base) => `${base} - Listar questionários cadastrados`,
  },
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
