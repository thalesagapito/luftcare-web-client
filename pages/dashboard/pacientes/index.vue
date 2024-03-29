<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
      el-button(type="default" plain @click="refetchPatients") Atualizar
      el-button(type="primary" @click="goToAddPatient") Adicionar paciente
    shadowed-card.mt-7
      patients-table(
        v-bind="patientsTableProps"
        @update-sort="updatePatientsQueryArgs('orderBy', $event)"
        @update-page-size="updatePatientsQueryArgs('resultsPerPage', $event)"
        @update-current-page="updatePatientsQueryArgs('pageNumber', $event)"
      )
        el-table-column(
          fixed="right"
          label="Ações"
          align="right"
          width="235"
        )
          .action-buttons(slot-scope="{ row }")
            el-button(round size="mini" type="text" @click="() => goToPatientOverview(row.id)") Ver tratamento
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { ExecutionResult } from 'graphql';

import { replaceParamsInPath } from '~/helpers/routing';
import PatientsQueryGQL from '~/graphql/queries/User/patients';
import { UpdateFieldWithValueFunction } from '~/types/helpers';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import { Query, PatientsQuery, QueryUsersArgs } from '~/types/gql';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { PATIENT_PATH } from '~/pages/dashboard/pacientes/_id.vue';
import { ADD_PATIENT_PATH } from '~/pages/dashboard/pacientes/adicionar.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import PatientsTable, { Props as TableProps } from '~/components/molecules/tables/TableOrderablePaginated.vue';

export const PATIENTS_PATH = '/dashboard/pacientes';

type Patient = Query['users']['results'][0];

type Data = {
  patients?: ExecutionResult<Query['users']>['data']
  patientsQueryArgs: QueryUsersArgs;
  isPatientsTableLoading: number;
};
type Methods = {
  goToAddPatient: () => void;
  refetchPatients: () => void;
  goToPatientOverview: (id: string) => void;
  updatePatientsQueryArgs: UpdateFieldWithValueFunction<Data['patientsQueryArgs']>;
};
type Computed = {
  headerProps: HeaderProps;
  patientsTableProps: TableProps;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard, PatientsTable },
  data() {
    return {
      isPatientsTableLoading: 0,
      patients: undefined,
      patientsQueryArgs: {
        pageNumber: undefined,
        resultsPerPage: 10,
        orderBy: [],
      },
    };
  },
  apollo: {
    patients: {
      prefetch: false,
      query: PatientsQueryGQL,
      loadingKey: 'isPatientsTableLoading',
      error: debounce(smartQueryErrorHandler, 10),
      update: ({ users } : PatientsQuery) => users,
      variables() { return this.patientsQueryArgs; },
    },
  },
  computed: {
    headerProps() {
      return {
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Pacientes', to: '/dashboard/pacientes' },
          ],
        },
        title: 'Listar Pacientes',
      };
    },
    patientsTableProps() {
      return {
        tableProps: {
          stripe: true,
          border: true,
          isLoading: this.isPatientsTableLoading,
          data: this.patients?.results,
        },
        tablePaginationProps: {
          total: this.patients?.totalResultsCount,
          pageSize: this.patientsQueryArgs.resultsPerPage || 10,
          currentPage: this.patientsQueryArgs.pageNumber || 1,
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
    if (this.$route.query.refetch) this.refetchPatients();
  },
  methods: {
    goToAddPatient() {
      this.$router.push(ADD_PATIENT_PATH);
    },
    refetchPatients() {
      this.$apollo.queries.patients?.refetch();
    },
    goToPatientOverview(id) {
      const path = replaceParamsInPath(PATIENT_PATH, { id });
      this.$router.push(path);
    },
    updatePatientsQueryArgs(field, value) {
      this.patientsQueryArgs = { ...this.patientsQueryArgs, [field]: value };
    },
  },
  head: { titleTemplate: (base) => `${base} - Listar pacientes cadastrados` },
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
