<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
      el-button(type="default" plain @click="refetchDoctors") Atualizar
      el-button(type="primary" @click="goToAddDoctor") Adicionar médico
    shadowed-card.mt-7
      doctors-table(
        v-bind="doctorsTableProps"
        @update-sort="updateDoctorsQueryArgs('orderBy', $event)"
        @update-page-size="updateDoctorsQueryArgs('resultsPerPage', $event)"
        @update-current-page="updateDoctorsQueryArgs('pageNumber', $event)"
      )
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { ExecutionResult } from 'graphql';

import DoctorsQueryGQL from '~/graphql/queries/User/doctors';
import { UpdateFieldWithValueFunction } from '~/types/helpers';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import { Query, DoctorsQuery, QueryUsersArgs } from '~/types/gql';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { ADD_DOCTOR_PATH } from '~/pages/dashboard/medicos/adicionar.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import DoctorsTable, { Props as TableProps } from '~/components/molecules/tables/TableOrderablePaginated.vue';

export const DOCTORS_PATH = '/dashboard/medicos';

type Doctor = Query['users']['results'][0];

type Data = {
  doctors?: ExecutionResult<Query['users']>['data']
  doctorsQueryArgs: QueryUsersArgs;
  isDoctorsTableLoading: 0;
};
type Methods = {
  goToAddDoctor: () => void;
  refetchDoctors: () => void;
  updateDoctorsQueryArgs: UpdateFieldWithValueFunction<Data['doctorsQueryArgs']>;
};
type Computed = {
  headerProps: HeaderProps;
  doctorsTableProps: TableProps;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAdmin,
  components: { TheHeader, ShadowedCard, DoctorsTable },
  data() {
    return {
      isDoctorsTableLoading: 0,
      doctors: undefined,
      doctorsQueryArgs: {
        pageNumber: undefined,
        resultsPerPage: 10,
        orderBy: [],
      },
    };
  },
  apollo: {
    doctors: {
      query: DoctorsQueryGQL,
      loadingKey: 'isDoctorsTableLoading',
      error: debounce(smartQueryErrorHandler, 10),
      update: ({ users } : DoctorsQuery) => users,
      variables() { return this.doctorsQueryArgs; },
    },
  },
  computed: {
    headerProps() {
      return {
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Médicos', to: '/dashboard/medicos' },
          ],
        },
        title: 'Listar Médicos',
      };
    },
    doctorsTableProps() {
      return {
        tableProps: {
          stripe: true,
          border: true,
          isLoading: this.isDoctorsTableLoading,
          data: this.doctors?.results,
        },
        tablePaginationProps: {
          total: this.doctors?.totalResultsCount,
          pageSize: this.doctorsQueryArgs.resultsPerPage || 10,
          currentPage: this.doctorsQueryArgs.pageNumber || 1,
          layout: 'total, sizes, ->, prev, pager, next',
          pageSizes: [5, 10, 15, 20, 25],
        },
        tableColumns: [
          {
            id: 1, label: 'Nome', prop: 'name', sortable: 'custom',
          },
          {
            id: 2, label: 'Email', prop: 'email', sortable: 'custom',
          },
          {
            id: 3, label: 'Telefone', prop: 'phoneNumber', sortable: 'custom',
          },
        ],
      };
    },
  },
  mounted() {
    if (this.$route.query.refetch) this.refetchDoctors();
  },
  methods: {
    goToAddDoctor() {
      this.$router.push(ADD_DOCTOR_PATH);
    },
    refetchDoctors() {
      this.$apollo.queries.doctors?.refetch();
    },
    updateDoctorsQueryArgs(field, value) {
      this.doctorsQueryArgs = { ...this.doctorsQueryArgs, [field]: value };
    },
  },
  head: { titleTemplate: (base) => `${base} - Listar médicos cadastrados` },
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
