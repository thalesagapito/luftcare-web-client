<template lang="pug">
  .wrapper
    the-header(v-bind="headerProps")
      el-button(type="primary") Criar novo formulário
    shadowed-card.mt-7(vertical)
      el-table(v-bind="tableProps" v-loading="tableLoading")
        el-table-column(
          v-for="col in tableColumns"
          :key="col.id"
          v-bind="col"
        )
      .p-2: el-pagination(
        v-bind="paginationProps"
        @size-change="updatePageSize"
        @current-change="updateCurrentPage"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { ExecutionResult } from 'graphql';
import { Pagination, Table, TableColumn } from 'element-ui';
import { Query, QuerySymptomAnalysisFormsArgs } from '~/types/gql';
import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import currentForms from '~/graphql/queries/SymptomAnalysisForms/currentForms';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';

type Data = {
  formsQueryResult?: ExecutionResult<Query['symptomAnalysisForms']>['data']
  formsFilters: QuerySymptomAnalysisFormsArgs;
  tableLoading: 0;
};
type Methods = {
  updatePageSize: (newSize: number) => void;
  updateCurrentPage: (newCurrentPage: number) => void;
};
type Computed = {
  headerProps: HeaderProps;
  tableProps: Partial<Table>;
  tableColumns: Partial<TableColumn & { id: number }>[];
  paginationProps: Partial<Pagination>;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard },
  data() {
    return {
      tableLoading: 0,
      formsQueryResult: undefined,
      formsFilters: {
        isPublished: undefined,
        pageNumber: undefined,
        resultsPerPage: 20,
        orderBy: [],
        name: undefined,
      },
    };
  },
  apollo: {
    formsQueryResult: {
      query: currentForms,
      loadingKey: 'tableLoading',
      error: debounce(smartQueryErrorHandler, 10),
      update: ({ symptomAnalysisForms }) => symptomAnalysisForms,
      variables() { return this.formsFilters; },
    },
  },
  computed: {
    headerProps() {
      return {
        breadcrumbs: {
          items: [{ label: 'Formulários', to: '/dashboard/formularios' }],
        },
        title: 'Listar Formulários',
      };
    },
    paginationProps() {
      return {
        total: this.formsQueryResult?.totalResultsCount,
        pageSize: this.formsFilters.resultsPerPage || undefined,
        currentPage: this.formsFilters.pageNumber || undefined,
        layout: 'total, sizes, ->, prev, pager, next',
        // pageSizes: [1, 2, 3, 4, 5, 20],
        // hideOnSinglePage: true,
      };
    },
    tableProps() {
      return {
        data: this.formsQueryResult?.results,
      };
    },
    tableColumns() {
      return [
        {
          id: 1,
          label: 'Nome',
          prop: 'name',
          sortable: 'custom',
        },
        {
          id: 2,
          label: 'Versão atual',
          prop: 'version',
          sortable: 'custom',
        },
      ];
    },
  },
  methods: {
    updatePageSize(resultsPerPage: number) {
      this.formsFilters = { ...this.formsFilters, resultsPerPage };
    },
    updateCurrentPage(pageNumber: number) {
      this.formsFilters = { ...this.formsFilters, pageNumber };
    },
  },
});
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply flex flex-col w-full pl-6 pr-8 py-8;
}
</style>
