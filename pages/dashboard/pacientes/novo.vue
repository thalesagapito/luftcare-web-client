<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-5.mt-4
      patient-form(
        v-model="patientData"
        :is-valid.sync="isFormValid"
      )

      .form-section-footer
        el-button(type="default" @click="$router.push('/dashboard/pacientes')") Cancelar
        el-button(
          type="primary"
          :disabled="!isFormValid"
          @click="runCreatePatientMutation"
        ) Adicionar paciente
</template>

<script lang="ts">
import Vue from 'vue';

import { RegisteredLayout, RegisteredMiddleware } from '@/enums';
import {
  CreateUserInput, MutationCreateUserArgs, UserKind, UserRole,
} from '@/types/gql';
import CreateUserMutationGQL from '@/graphql/mutations/User/createUser';

import ShadowedCard from '@/components/atoms/ShadowedCard.vue';
import TheHeader, { Props as HeaderProps } from '@/components/molecules/HeaderWithBreadcrumbs.vue';
import PatientForm, { Props as FormProps } from '@/components/organisms/forms/user/PatientForm.vue';

type Data = {
  isFormValid: boolean;
  patientData: FormProps['value'];
};
type Methods = {
  runCreatePatientMutation: () => void;
  handleFormCreationSuccess: () => void;
};
type Computed = {
  headerProps: HeaderProps;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard, PatientForm },
  data() {
    return {
      isFormValid: false,
      patientData: {
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
        title: 'Adicionar paciente',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Pacientes', to: '/dashboard/pacientes' },
            { label: 'Adicionar', to: '' },
          ],
        },
      };
    },
  },
  methods: {
    async runCreatePatientMutation() {
      const userData: CreateUserInput = {
        ...this.patientData,
        kind: UserKind.Patient,
        role: UserRole.NonAdmin,
      };
      const mutationArgs: MutationCreateUserArgs = { userData };
      const loading = this.$loading({ lock: true, text: 'Adicionando paciente...' });

      await this.$apollo
        .mutate({ mutation: CreateUserMutationGQL, variables: mutationArgs })
        .then(this.handleFormCreationSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    handleFormCreationSuccess() {
      this.$notify({ title: 'Sucesso', type: 'success', message: 'Paciente adicionado com sucesso' });
      this.$router.push({ name: 'dashboard-pacientes', params: { refetch: '1' } });
    },
  },
  head: {
    titleTemplate: (base) => `${base} - Adicionar paciente`,
  },
});
</script>

<style lang="postcss" scoped>
.dashboard-page-wrapper {
  .form-section-footer {
    @apply flex justify-end mb-0 mt-5;
  }
}
</style>
