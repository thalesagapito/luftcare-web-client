<template lang="pug">
  .table-wrapper
    el-table(
      v-bind="tableProps"
      v-loading="tableProps.isLoading"
      @sort-change="emitUpdateSort"
    )
      slot
      el-table-column(
        v-for="col in tableColumns"
        :key="col.id"
        v-bind="col"
      )
    .p-2: el-pagination(
      v-bind="tablePaginationProps"
      @size-change="emitUpdatePageSize"
      @current-change="emitUpdateCurrentPage"
    )
</template>

<script lang="ts">
import Vue from 'vue';
import { Table, Pagination } from 'element-ui';
import { TableColumn, SortOrders } from 'element-ui/types/table-column';
import { RecordPropsDefinition } from 'vue/types/options';
import { OrderByClauseDirection, OrderByClause } from '~/types/gql';

const convertElementUiSortOrderToGraphqlSortOrder = (order: SortOrders): OrderByClauseDirection => {
  switch (order) {
    case 'ascending':
      return OrderByClauseDirection.Asc;
    default:
    case 'descending':
      return OrderByClauseDirection.Desc;
  }
};

type SortChangeArgs = {
  column: TableColumn;
  order: SortOrders;
  prop: string;
};

type Data = {};
type Methods = {
  emitUpdatePageSize: (newSize: number) => void;
  emitUpdateCurrentPage: (newCurrentPage: number) => void;
  emitUpdateSort: (args: SortChangeArgs) => void;
};
type Computed = {};
export type Props = {
  tableProps: Partial<Table> & { isLoading?: number | boolean };
  tableColumns?: (Partial<TableColumn> & { id: number | string, sortable: 'custom' })[];
  tablePaginationProps?: Partial<Pagination>;
};
export type Events = {
  'update-page-size': number;
  'update-current-page': number;
  'update-sort': OrderByClause[];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    tableProps: {
      type: Object,
      required: true,
      default: () => ({
        stripe: true,
      }),
    },
    tablePaginationProps: {
      type: Object,
      required: false,
      default: () => ({
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        hideOnSinglePage: false,
        layout: 'total, sizes, ->, prev, pager, next',
      }),
    },
    tableColumns: {
      type: Array,
      required: false,
      default: () => [],
    },
  } as RecordPropsDefinition<Props>,
  methods: {
    emitUpdatePageSize(pageSize) {
      this.$emit<Events, 'update-page-size'>('update-page-size', pageSize);
    },
    emitUpdateCurrentPage(currentPage) {
      this.$emit<Events, 'update-current-page'>('update-current-page', currentPage);
    },
    emitUpdateSort({ order, prop }) {
      const isRemovingSorting = !order;
      if (isRemovingSorting) {
        this.$emit<Events, 'update-sort'>('update-sort', []);
        return;
      }

      const orderByClause: OrderByClause = {
        columnName: prop,
        direction: convertElementUiSortOrderToGraphqlSortOrder(order),
      };

      this.$emit<Events, 'update-sort'>('update-sort', [orderByClause]);
    },
  },
});
</script>

<style lang="postcss" scoped>

</style>
