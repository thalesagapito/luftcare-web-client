<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    shadowed-card.preferences-card
      .title Meu perfil
      .preference-link(v-for="{ label, onClick } in profileLinks")
        el-link(@click="onClick" type="primary" :underline="false") {{ label }}
</template>

<script lang="ts">
import Vue from 'vue';

import { RegisteredLayout, RegisteredMiddleware } from '~/enums';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { UPDATE_PASSWORD_PATH } from '~/pages/dashboard/preferencias/alterar-senha.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';

export const PREFERENCES_PATH = '/dashboard/preferencias';

type PreferenceLink = { label: string, onClick: () => void };

type Data = {};
type Methods = {};
type Computed = {
  headerProps: HeaderProps;
  profileLinks: PreferenceLink[];
};
export type Props = {};
export type Events = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard },
  computed: {
    headerProps() {
      return {
        title: 'Preferências',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Preferências', to: '' },
          ],
        },
      };
    },
    profileLinks() {
      return [
        { label: 'Alterar senha', onClick: () => this.$router.push(UPDATE_PASSWORD_PATH) },
      ];
    },
  },
  head: { titleTemplate: (base) => `${base} - Preferências` },
});
</script>

<style lang="postcss" scoped>
.preferences-card {
  @apply mt-6 p-6;

  .title {
    @apply text-lg font-semibold mb-4;
  }

  .preference-link {
    @apply p-3 border-l-1;

    &:not(:last-of-type) {
      @apply border-b-1;
    }
  }
}
</style>
