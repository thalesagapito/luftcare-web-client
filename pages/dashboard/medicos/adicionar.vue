<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-5.mt-4
      doctor-form(
        v-model="doctorData"
        :is-valid.sync="isFormValid"
      )

      .form-section-footer
        el-button(type="default" @click="goToDoctors") Cancelar
        el-button(
          type="primary"
          :disabled="!isFormValid"
          @click="runCreateDoctorMutation"
        ) Adicionar médico
</template>

<script lang="ts">
import Vue from 'vue';

import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import CreateUserMutationGQL from '~/graphql/mutations/User/createUser';
import { CreateUserInput, MutationCreateUserArgs, UserRole } from '~/types/gql';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { DOCTORS_PATH } from '~/pages/dashboard/medicos/index.vue';
import DoctorForm, { Props as FormProps } from '~/components/organisms/forms/user/DoctorForm.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';

export const ADD_DOCTOR_PATH = '/dashboard/medicos/adicionar';

type Data = {
  isFormValid: boolean;
  doctorData: FormProps['value'];
};
type Methods = {
  goToDoctors: (refetch?: boolean) => void;
  runCreateDoctorMutation: () => void;
  handleDoctorCreationSuccess: () => void;
};
type Computed = {
  headerProps: HeaderProps;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAdmin,
  components: { TheHeader, ShadowedCard, DoctorForm },
  data() {
    return {
      isFormValid: false,
      doctorData: {
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
      },
    };
  },
  computed: {
    headerProps() {
      return {
        title: 'Adicionar médico',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Médicos', to: '/dashboard/medicos' },
            { label: 'Adicionar', to: '' },
          ],
        },
      };
    },
  },
  methods: {
    async runCreateDoctorMutation() {
      const userData: CreateUserInput = {
        ...this.doctorData,
        role: UserRole.Doctor,
      };
      const mutationArgs: MutationCreateUserArgs = { userData };
      const loading = this.$loading({ lock: true, text: 'Adicionando médico...' });

      await this.$apollo
        .mutate({ mutation: CreateUserMutationGQL, variables: mutationArgs })
        .then(this.handleDoctorCreationSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    handleDoctorCreationSuccess() {
      this.$notify({ title: 'Sucesso', type: 'success', message: 'Médico adicionado com sucesso' });
      this.goToDoctors(true);
    },
    goToDoctors(refetch) {
      const path = DOCTORS_PATH;
      if (refetch) {
        const query = { refetch: '1' };
        this.$router.push({ path, query });
        return;
      }
      this.$router.push(path);
    },
  },
  head: { titleTemplate: (base) => `${base} - Adicionar médico` },
});
</script>

<style lang="postcss" scoped>
.dashboard-page-wrapper {
  .form-section-footer {
    @apply flex justify-end mb-0 mt-5;
  }
}
</style>
