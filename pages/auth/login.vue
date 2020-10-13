<template lang="pug">
  .login-wrapper
    h1.title Entrar na minha conta
    el-form(v-bind="formProps" ref="loginForm")
      .mb-6: el-form-item(label="Email" prop="email")
        el-input(
          autofocus
          type="email"
          autocomplete="email"
          placeholder="Digite seu endereço de email aqui"
          v-model="email"
          @keyup.enter.native="moveFocusToPasswordField"
        )
      .mb-7: el-form-item(label="Senha" prop="password")
        el-input(
          type="password"
          ref="passwordField"
          autocomplete="email"
          placeholder="Digite sua senha aqui"
          v-model="password"
          @keyup.enter.native="validateFormAndLogin"
        )
      el-form-item.flex.justify-end
        el-button(
          type="primary"
          @click="validateFormAndLogin"
        ) Login
</template>

<script lang="ts">
import Vue from 'vue';
import { Form } from 'element-ui';

import { MutationLoginArgs } from '~/types/gql';
import { ElFormProps } from '~/types/element-ui';
import { MutationResponseHandler } from '~/types/helpers';
import LoginMutation from '~/graphql/mutations/User/login';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';

import { DASHBOARD_PATH } from '~/pages/dashboard/index.vue';

export const LOGIN_PATH = '/auth/login';

type Data = {
  email?: string;
  password?: string;
};
type Methods = {
  loginUser: () => void;
  validateFormAndLogin: () => void;
  passTokenToApolloClient: MutationResponseHandler['Success'];
  moveFocusToPasswordField: () => void;
};
type Computed = {
  formProps: ElFormProps<'email'|'password'>;
};

export default Vue.extend<Data, Methods, Computed, {}>({
  layout: RegisteredLayout.auth,
  middleware: RegisteredMiddleware.isUserGuest,
  data() {
    return { email: undefined, password: undefined };
  },
  computed: {
    formProps() {
      return {
        hideRequiredAsterisk: true,
        model: { email: this.email, password: this.password },
        rules: {
          email: [{ type: 'email', required: true, message: 'Insira um endereço de email válido' }],
          password: [{ type: 'string', required: true, message: 'O campo senha é obrigatório' }],
        },
      };
    },
  },
  methods: {
    validateFormAndLogin() {
      (this.$refs.loginForm as Form).validate((isValid) => {
        if (!isValid) return;

        this.loginUser();
      });
    },
    async loginUser() {
      if (!this.email || !this.password) return;

      const loginArgs: MutationLoginArgs = {
        email: this.email,
        password: this.password,
      };

      const loading = this.$loading({ lock: true, text: 'Entrando' });

      await this.$apollo
        .mutate({ mutation: LoginMutation, variables: loginArgs })
        .then(this.passTokenToApolloClient)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    async passTokenToApolloClient({ data }) {
      const authToken = data?.login.authorization || '';
      const refreshToken = data?.login.authorization || '';
      await this.$apolloHelpers.onLogin(authToken);
      this.$accessor.auth.setRefreshToken(refreshToken);
      this.$router.push(DASHBOARD_PATH);
    },
    moveFocusToPasswordField() {
      (this.$refs.passwordField as HTMLElement).focus();
    },
  },
  head: {
    titleTemplate: (base) => `${base} - Login`,
  },
});
</script>

<style lang="postcss" scoped>
.login-wrapper {
  @apply flex flex-col;
}
</style>
