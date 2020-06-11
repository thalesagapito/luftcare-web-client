<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
      el-button(type="primary" @click="$router.push('questionarios/novo')") Criar novo questionário
    shadowed-card.mt-7
      questionnaires-table(
        v-bind="questionnairesTableProps"
        @update-sort="updateSort"
        @update-page-size="updatePageSize"
        @update-current-page="updateCurrentPage"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { ExecutionResult } from 'graphql';
import { Query, QuerySymptomQuestionnairesArgs } from '~/types/gql';
import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import currentSymptomQuestionnaires from '~/graphql/queries/SymptomQuestionnaires/currentSymptomQuestionnaires';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import QuestionnairesTable, { Props as TableProps, Events as TableEvents } from '~/components/molecules/tables/TableOrderablePaginated.vue';

type Data = {
  questionnairesQueryResult?: ExecutionResult<Query['symptomQuestionnaires']>['data']
  questionnairesFilters: QuerySymptomQuestionnairesArgs;
  isQuestionnairesTableLoading: 0;
};
type Methods = {
  updateSort: (args: TableEvents['update-sort']) => void;
  updatePageSize: (newSize: TableEvents['update-page-size']) => void;
  updateCurrentPage: (newCurrentPage: TableEvents['update-current-page']) => void;
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
      questionnairesQueryResult: undefined,
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
    questionnairesQueryResult: {
      query: currentSymptomQuestionnaires,
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
          isLoading: this.isQuestionnairesTableLoading,
          data: this.questionnairesQueryResult?.results,
        },
        tablePaginationProps: {
          total: this.questionnairesQueryResult?.totalResultsCount,
          pageSize: this.questionnairesFilters.resultsPerPage || 10,
          currentPage: this.questionnairesFilters.pageNumber || 1,
          layout: 'total, sizes, ->, prev, pager, next',
          pageSizes: [5, 10, 25],
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
  methods: {
    updateSort(orderBy: TableEvents['update-sort']) {
      this.questionnairesFilters = { ...this.questionnairesFilters, orderBy };
    },
    updatePageSize(resultsPerPage: TableEvents['update-page-size']) {
      this.questionnairesFilters = { ...this.questionnairesFilters, resultsPerPage };
    },
    updateCurrentPage(pageNumber: TableEvents['update-current-page']) {
      this.questionnairesFilters = { ...this.questionnairesFilters, pageNumber };
    },
  },
  head: {
    titleTemplate: (base) => `${base} - Listar questionários cadastrados`,
  },
});
</script>

<style lang="postcss" scoped>
</style>
