import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $authMethodsLogout(): void
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $authMethodsLogout(): void
  }
}

export default Vue.extend({
  methods: {
    $authMethodsLogout() {
      this.$apolloHelpers.onLogout();
      this.$accessor.auth.clearRefreshToken();
      this.$router.push('/auth/login');
    },
  },
});
