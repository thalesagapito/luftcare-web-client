<template lang="pug">
  .login-wrapper
    h1.mb-10 Login page
    //- nuxt-link(to="/") Current User
    input(v-model="computedEmail")
    label(for="password") Password
    input(name="password" type="password" v-model="password")
    button(type="submit" @click="loginUser") Login
</template>

<script lang="ts">
import Vue from 'vue';
import { ExecutionResult } from 'graphql';
import LoginMutationGQL from '@/graphql/mutations/User/login';
import { MutationLoginArgs, Mutation } from '@/types/gql';

type Data = {
  email?: string;
  password?: string;
};
type Methods = {
  loginUser: () => void;
  passTokenToApolloClient: (result: ExecutionResult<Mutation['login']>) => void;
};
type Computed = {
  computedEmail: string | undefined;
};

export default Vue.extend<Data, Methods, Computed, {}>({
  data() {
    return {
      email: undefined,
      password: undefined,
    };
  },
  middleware: ['isUserGuest'],
  computed: {
    computedEmail: {
      get() { return this.email; },
      set(newValue) { this.email = newValue; },
    },
  },
  methods: {
    async loginUser() {
      if (!this.email || !this.password) return;

      const loginArgs: MutationLoginArgs = {
        email: this.email,
        password: this.password,
      };

      await this.$apollo
        .mutate({ mutation: LoginMutationGQL, variables: loginArgs })
        .then(this.passTokenToApolloClient)
        .catch(this.$clientErrorHandler);
    },
    async passTokenToApolloClient({ data }) {
      const authToken = data?.authorization as string;
      const refreshToken = data?.authorization as string;
      await this.$apolloHelpers.onLogin(authToken);
      this.$accessor.auth.setRefreshToken(refreshToken);
      this.$router.push('/');
    },
  },
});
</script>

<style lang="postcss" scoped>
.login-wrapper {
  @apply flex flex-col px-2;

  input {
    @apply border;
  }
}
</style>
