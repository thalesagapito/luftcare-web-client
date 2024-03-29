<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-5.mt-4
      patient-form(
        v-model="patientData"
        :is-valid.sync="isFormValid"
      )

      .form-section-footer
        el-button(type="default" @click="goToPatients") Cancelar
        el-button(
          type="primary"
          :disabled="!isFormValid"
          @click="runCreatePatientMutation"
        ) Adicionar paciente
</template>

<script lang="ts">
import Vue from 'vue';

import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import CreateUserMutationGQL from '~/graphql/mutations/User/createUser';
import { CreateUserInput, MutationCreateUserArgs, UserRole } from '~/types/gql';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { PATIENTS_PATH } from '~/pages/dashboard/pacientes/index.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import PatientForm, { Props as FormProps } from '~/components/organisms/forms/user/PatientForm.vue';

export const ADD_PATIENT_PATH = '/dashboard/pacientes/adicionar';

type Data = {
  isFormValid: boolean;
  patientData: FormProps['value'];
};
type Methods = {
  goToPatients: (refetch?: boolean) => void;
  runCreatePatientMutation: () => void;
  handlePatientCreationSuccess: () => void;
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
        role: UserRole.Patient,
      };
      const mutationArgs: MutationCreateUserArgs = { userData };
      const loading = this.$loading({ lock: true, text: 'Adicionando paciente...' });

      await this.$apollo
        .mutate({ mutation: CreateUserMutationGQL, variables: mutationArgs })
        .then(this.handlePatientCreationSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    handlePatientCreationSuccess() {
      this.$notify({ title: 'Sucesso', type: 'success', message: 'Paciente adicionado com sucesso' });
      this.goToPatients(true);
    },
    goToPatients(refetch) {
      const path = PATIENTS_PATH;
      if (refetch) {
        const query = { refetch: '1' };
        this.$router.push({ path, query });
        return;
      }
      this.$router.push(path);
    },
  },
  head: { titleTemplate: (base) => `${base} - Adicionar paciente` },
});
</script>

<style lang="postcss" scoped>
.dashboard-page-wrapper {
  .form-section-footer {
    @apply flex justify-end mb-0 mt-5;
  }
}
</style>
