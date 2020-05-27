<template lang="pug">
  .dashboard-wrapper
    el-menu.side-menu(router collapse="")
      img.logo(src="/logos/luftcare-logo-black.png")

      el-menu-item(index="/dashboard") Início
      el-menu-item(index="/dashboard/formularios") Formulários
      el-menu-item(@click="$authMethodsLogout") Sair
    .content
      nuxt
</template>

<script lang="ts">
import Vue from 'vue';
import { authMethods } from '~/mixins/RegisteredMixins';

export default Vue.extend<{}, {}, {}, {}>({
  mixins: [authMethods],
  methods: {},
});
</script>

<style lang="postcss" scoped>
.dashboard-wrapper {
  @apply flex w-screen;

  .side-menu {
    @apply hidden;
    .logo {
      @apply w-32 my-9 mx-auto;
    }
  }
  .content {
    @apply flex flex-col items-center justify-start w-full bg-white;
  }
}

@screen md {
  .dashboard-wrapper {
    .side-menu {
      display: unset;
      width: 22rem;
    }
  }
}

</style>
