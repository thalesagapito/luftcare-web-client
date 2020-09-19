import Vue from 'vue';
import { LOGIN_PATH } from '~/pages/auth/login.vue';

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
      this.$router.push(LOGIN_PATH);
    },
  },
});
