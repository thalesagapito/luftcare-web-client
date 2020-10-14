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
        el-table-column(
          label="Status"
          align="center"
          width="120"
        )
          template(slot-scope="{ row }")
            el-tag(v-if="row.canLogin" size="small") Com acesso
            el-tag.opacity-50(v-else size="small") Sem acesso
        el-table-column(
          fixed="right"
          label="Ações"
          align="right"
          width="235"
        )
          .action-buttons(slot-scope="{ row }")
            el-popconfirm(
              v-if="row.canLogin"
              title="Desautorizar acesso a aplicação?"
              confirmButtonText="Sim, remover"
              cancelButtonText="Cancelar"
              hide-icon
              @onConfirm="changeLoginCapability(row, false)"
            )
              el-button(round size="mini" type="text" slot="reference") Desautorizar acesso
            el-popconfirm(
              v-else
              title="Autorizar acesso a aplicação?"
              confirmButtonText="Sim, autorizar"
              cancelButtonText="Cancelar"
              hide-icon
              @onConfirm="changeLoginCapability(row, true)"
            )
              el-button(round size="mini" type="text" slot="reference") Autorizar acesso
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { ExecutionResult } from 'graphql';

import DoctorsQueryGQL from '~/graphql/queries/User/doctors';
import { MutationResponseHandler, UpdateFieldWithValueFunction } from '~/types/helpers';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import { Query, DoctorsQuery, QueryUsersArgs } from '~/types/gql';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';
import ChangeLoginCapabilityMutationGQL from '~/graphql/mutations/User/changeLoginCapability';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { ADD_DOCTOR_PATH } from '~/pages/dashboard/medicos/adicionar.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import DoctorsTable, { Props as TableProps } from '~/components/molecules/tables/TableOrderablePaginated.vue';

export const DOCTORS_PATH = '/dashboard/medicos';

type Doctor = Query['users']['results'][0];

type Data = {
  doctors?: ExecutionResult<Query['users']>['data']
  doctorsQueryArgs: QueryUsersArgs;
  isDoctorsTableLoading: number;
};
type Methods = {
  goToAddDoctor: () => void;
  refetchDoctors: () => void;
  changeLoginCapability: (doctor: Doctor, canLogin: Doctor['canLogin']) => void;
  updateDoctorsQueryArgs: UpdateFieldWithValueFunction<Data['doctorsQueryArgs']>;
  handleChangeCapabilitySuccess: MutationResponseHandler['Success'];
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
      doctors: { results: [], totalResultsCount: 0, hasMorePages: false },
      doctorsQueryArgs: {
        pageNumber: undefined,
        resultsPerPage: 10,
        orderBy: [],
      },
    };
  },
  apollo: {
    doctors: {
      prefetch: false,
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
    changeLoginCapability({ id }, canLogin) {
      this.$apollo
        .mutate({
          mutation: ChangeLoginCapabilityMutationGQL,
          variables: { id, canLogin },
        })
        .then(this.handleChangeCapabilitySuccess)
        .catch(this.$clientErrorHandler);
    },
    handleChangeCapabilitySuccess({ data }) {
      this.$notify({
        title: 'Sucesso',
        message: data?.changeLoginCapability.userFriendlyMessage || '',
        type: 'success',
      });
      this.refetchDoctors();
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
