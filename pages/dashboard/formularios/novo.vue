<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")
    pre criar novo formulario
</template>

<script lang="ts">
import Vue from 'vue';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';

type Data = {};
type Methods = {};
type Computed = {
  headerProps: HeaderProps
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: 'dashboard' as RegisteredLayout,
  middleware: 'isUserAuthenticated' as RegisteredMiddleware,
  components: { TheHeader },
  computed: {
    headerProps() {
      return {
        title: 'Criar novo formulário',
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Formulários', to: '/dashboard/formularios' },
            { label: 'Criar', to: '/dashboard/formularios/novo' },
          ],
        },
      };
    },
  },
  head: {
    titleTemplate: (base) => `${base} - Criar novo formulário`,
  },
});
</script>

<style lang="postcss" scoped>

</style>
