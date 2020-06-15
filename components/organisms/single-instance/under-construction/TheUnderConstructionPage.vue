<template lang="pug">
  .under-construction-wrapper
    brand-logo.logo
    .title Versão beta
    .subtitle Ainda estamos em fase de desenvolvimento. Por isso somente usuários selecionados têm acesso.
    el-button(
      v-if="isUserLoggedIn"
      @click="$router.push('/dashboard')"
      round
    ) Acessar painel
    el-button(
      v-else
      @click="$router.push('/auth/login')"
      round
    ) Acessar minha conta
</template>

<script lang="ts">
import Vue from 'vue';
import BrandLogo from '~/components/atoms/BrandLogo.vue';

type Data = {};
type Methods = {};
type Computed = {
  isUserLoggedIn: boolean;
};
export type Props = {};
export type Events = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { BrandLogo },
  computed: {
    isUserLoggedIn() {
      return this.$accessor.auth.isLoggedIn;
    },
  },
});
</script>

<style lang="postcss" scoped>
.under-construction-wrapper {
  @apply w-full h-full bg-avocado flex flex-col items-center justify-center text-white;
  background-image: linear-gradient(to top right, #3AAFA2 0%, #f9f586 170%);

  .logo {
    @apply mb-9 h-7;
  }
  .title {
    @apply text-5xl font-bold mb-6;
  }
  .subtitle {
    @apply text-xl text-center max-w-sm mb-10;
  }
}
</style>
