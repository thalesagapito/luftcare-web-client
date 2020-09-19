<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.p-6
      update-password-form(v-model="formData" :is-valid.sync="isValid" :current-user-email="currentUserEmail")
      .buttons-container
        el-button(@click="goToPreferences") Cancelar
        el-button(type="primary" @click="submit") Alterar senha
</template>

<script lang="ts">
import Vue from 'vue';
import ShadowedCard from '@/components/atoms/ShadowedCard.vue';
import { RegisteredLayout, RegisteredMiddleware } from '@/enums';
import UpdatePasswordMutationGQL from '@/graphql/mutations/User/updatePassword';
import { ROUTE_NAME as PREFERENCES_ROUTE_NAME } from '@/pages/dashboard/preferencias/index.vue';
import TheHeader, { Props as HeaderProps } from '@/components/molecules/HeaderWithBreadcrumbs.vue';
import UpdatePasswordForm, { Props as FormProps } from '@/components/organisms/forms/update-password/UpdatePasswordForm.vue';
import { MutationUpdatePasswordArgs } from '~/types/gql';


export const ROUTE_NAME = 'dashboard-preferencias-alterar-senha';

type Data = {
  formData: FormProps['value'];
  isValid: FormProps['isValid'];
};
type Methods = {
  handlePasswordUpdateSuccess: () => void;
  goToPreferences: () => void;
  submit: () => void;
};
type Computed = {
  headerProps: HeaderProps;
  currentUserEmail: string;
};
export type Props = {};
export type Events = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard, UpdatePasswordForm },
  data() {
    return {
      formData: {
        currentPassword: '',
        newPassword: '',
      },
      isValid: false,
    };
  },
  computed: {
    headerProps() {
      return {
        title: 'Alterar senha',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Preferências', to: '/dashboard/preferencias' },
            { label: 'Alterar senha', to: '' },
          ],
        },
      };
    },
    currentUserEmail() {
      return this.$accessor.currentUser?.currentUser?.email || '';
    },
  },
  methods: {
    goToPreferences() {
      this.$router.push({ name: PREFERENCES_ROUTE_NAME });
    },
    async submit() {
      const variables: MutationUpdatePasswordArgs = {
        currentPassword: this.formData.currentPassword,
        newPassword: this.formData.newPassword,
      };
      const loading = this.$loading({ lock: true, text: 'Alterando senha...' });

      this.$apollo
        .mutate({ mutation: UpdatePasswordMutationGQL, variables })
        .then(this.handlePasswordUpdateSuccess)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    handlePasswordUpdateSuccess() {
      this.$notify({ title: 'Sucesso', type: 'success', message: 'Senha alterada com sucesso' });
      this.goToPreferences();
    },
  },
  head: { titleTemplate: (base) => `${base} - Alterar senha` },
});
</script>

<style lang="postcss" scoped>
.buttons-container {
  @apply flex justify-end items-center pt-4;
}
</style>
