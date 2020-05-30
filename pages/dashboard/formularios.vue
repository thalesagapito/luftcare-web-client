<template lang="pug">
  .wrapper
    the-header(v-bind="headerProps")
      el-button(type="primary") Criar novo formulário
    shadowed-card(vertical)
      el-button(@click="formsFilters.isPublished = !formsFilters.isPublished") toggle
      //- el-table
      pre TESTE
      pre {{ forms }}
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { ExecutionResult } from 'graphql';
import { Query } from '~/types/gql';
import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import currentForms from '~/graphql/queries/SymptomAnalysisForms/currentForms';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';

type Data = {
  forms?: ExecutionResult<Query['symptomAnalysisForms']>['data']
  formsFilters: { isPublished?: boolean };
};
type Methods = {};
type Computed = {
  headerProps: HeaderProps;
};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: { TheHeader, ShadowedCard },
  data() {
    return {
      forms: undefined,
      formsFilters: {
        isPublished: undefined,
      },
    };
  },
  apollo: {
    forms: {
      query: currentForms,
      error: debounce(smartQueryErrorHandler, 10),
      update: ({ symptomAnalysisForms }) => symptomAnalysisForms,
      variables() {
        return {
          isPublished: this.formsFilters.isPublished,
        };
      },
    },
  },
  computed: {
    headerProps() {
      return {
        breadcrumbs: {
          items: [{ label: 'Formulários', to: '/dashboard/formularios' }],
        },
        title: 'Listar Formulários',
      };
    },
  },
  // methods: {
  //   a() {
  //     this.forms
  //   }
  // }
});
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply flex flex-col w-full px-6 py-8;
}
</style>
