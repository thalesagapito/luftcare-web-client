<template lang="pug">
  nav.navbar-links-wrapper
    n-link.link.highlight(to="/sell") Vender

    n-link.link(v-for="{ id, url, label, icon } in links" :to="url" :key="id" ) {{ label }}

    template(v-if="isLoggedIn")
      n-link.link(to="/closet") Meu closet
      n-link.link(to="/profile") Meu perfil
      .link(@click="$authMethodsLogout") Logout

    template(v-else)
      n-link.link(to="/auth/login") Login
</template>

<script lang="ts">
import Vue from 'vue';
import { authMethods } from '~/mixins/RegisteredMixins';

type NavLink = {
  id: number
  url: string
  label: string
};

export default Vue.extend({
  mixins: [authMethods],
  computed: {
    isLoggedIn(): boolean {
      return this.$accessor.auth.isLoggedIn;
    },
    isMenuDrawerOpen(): boolean {
      return this.$accessor.layout.isMenuDrawerOpen;
    },
    links(): NavLink[] {
      return [
        { id: 1, url: '/new-releases', label: 'Lançamentos' },
        { id: 2, url: '/hottest', label: 'Mais quentes' },
        { id: 3, url: '/news', label: 'Notícias' },
      ];
    },
  },
});
</script>

<style lang="postcss" scoped>
.navbar-links-wrapper {
  @apply flex justify-start h-full uppercase font-semibold text-sm;
  .link {
    @apply px-2 flex items-center h-full text-black transition-colors duration-300 ease-in-out;
  }
  .more {
    @apply text-xl px-3;
  }
}
</style>
