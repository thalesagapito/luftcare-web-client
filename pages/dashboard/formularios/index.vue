<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
      el-button(type="primary" @click="$router.push('formularios/novo')") Criar novo formulário
    shadowed-card.mt-7
      forms-table(
        v-bind="formsTableProps"
        @update-sort="updateSort"
        @update-page-size="updatePageSize"
        @update-current-page="updateCurrentPage"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { ExecutionResult } from 'graphql';
import { Query, QuerySymptomAnalysisFormsArgs } from '~/types/gql';
import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import currentForms from '~/graphql/queries/SymptomAnalysisForms/currentForms';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import FormsTable, { Props as TableProps, Events as TableEvents } from '~/components/molecules/tables/TableOrderablePaginated.vue';

type Data = {
  formsQueryResult?: ExecutionResult<Query['symptomAnalysisForms']>['data']
  formsFilters: QuerySymptomAnalysisFormsArgs;
  isFormsTableLoading: 0;
};
type Methods = {
  updateSort: (args: TableEvents['update-sort']) => void;
  updatePageSize: (newSize: TableEvents['update-page-size']) => void;
  updateCurrentPage: (newCurrentPage: TableEvents['update-current-page']) => void;
};
type Computed = {
  headerProps: HeaderProps;
  formsTableProps: TableProps;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard, FormsTable },
  data() {
    return {
      isFormsTableLoading: 0,
      formsQueryResult: undefined,
      formsFilters: {
        isPublished: undefined,
        pageNumber: undefined,
        resultsPerPage: 10,
        orderBy: [],
        name: undefined,
      },
    };
  },
  apollo: {
    formsQueryResult: {
      query: currentForms,
      loadingKey: 'isFormsTableLoading',
      error: debounce(smartQueryErrorHandler, 10),
      update: ({ symptomAnalysisForms }) => symptomAnalysisForms,
      variables() { return this.formsFilters; },
    },
  },
  computed: {
    headerProps() {
      return {
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Formulários', to: '/dashboard/formularios' },
          ],
        },
        title: 'Listar Formulários',
      };
    },
    formsTableProps() {
      return {
        tableProps: {
          stripe: true,
          isLoading: this.isFormsTableLoading,
          data: this.formsQueryResult?.results,
        },
        tablePaginationProps: {
          total: this.formsQueryResult?.totalResultsCount,
          pageSize: this.formsFilters.resultsPerPage || 10,
          currentPage: this.formsFilters.pageNumber || 1,
          layout: 'total, sizes, ->, prev, pager, next',
          pageSizes: [5, 10, 25],
        },
        tableColumns: [
          {
            id: 1, label: 'Nome', prop: 'name', sortable: 'custom',
          },
          {
            id: 2, label: 'Versão atual', prop: 'version', sortable: 'custom',
          },
        ],
      };
    },
  },
  methods: {
    updateSort(orderBy: TableEvents['update-sort']) {
      this.formsFilters = { ...this.formsFilters, orderBy };
    },
    updatePageSize(resultsPerPage: TableEvents['update-page-size']) {
      this.formsFilters = { ...this.formsFilters, resultsPerPage };
    },
    updateCurrentPage(pageNumber: TableEvents['update-current-page']) {
      this.formsFilters = { ...this.formsFilters, pageNumber };
    },
  },
  head: {
    titleTemplate: (base) => `${base} - Listar formulários cadastrados`,
  },
});
</script>

<style lang="postcss" scoped>
</style>
