<template lang="pug">
  .container
    .title
      h2.text-5xl.font-bold Erro
      h1.text-6xl :/
    h3
      template(v-if="error.statusCode === 404") A página buscada não foi encontrada
      template(v-else) {{ error.message }}
    el-button(plain @click="redirect") Retornar à página inicial
</template>

<script lang="ts">
import Vue from 'vue';
import { RegisteredLayout } from '~/enums';
import { DASHBOARD_PATH } from '~/pages/dashboard/index.vue';

type Data = {};
type Methods = {
  redirect: () => void;
};
type Computed = {};
export type Props = {};
export type Events = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.empty,
  props: {
    error: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  methods: {
    redirect() {
      this.$router.push(DASHBOARD_PATH);
    },
  },
});
</script>

<style lang="postcss" scoped>
.container {
  @apply w-full h-full mx-auto flex flex-col items-center justify-center text-gray-600 pb-32;

  .title {
    @apply flex items-end;

    h2 {
      @apply mr-6;
    }
  }

  h3 {
    @apply text-xl my-6 text-gray-500;
  }
}
</style>
