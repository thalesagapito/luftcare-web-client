<template lang="pug">
  .login-wrapper
    h1.title Entrar na minha conta
    el-form(v-bind="formProps" ref="loginForm" hide-required-asterisk)
      el-form-item(label="Email" prop="email")
        el-input(
          type="email"
          autocomplete="email"
          placeholder="Digite seu endereço de email aqui"
          v-model="email"
        )
      el-form-item(label="Senha" prop="password")
        el-input(
          type="password"
          autocomplete="email"
          placeholder="Digite sua senha aqui"
          v-model="password"
        )
      el-form-item.flex.justify-end
        el-button(
          type="primary"
          @click="validateFormAndLogin"
        ) Login
</template>

<script lang="ts">
import Vue from 'vue';
import { ExecutionResult } from 'graphql';
import { ElFormProps } from '@/types/element-ui';
import LoginMutationGQL from '@/graphql/mutations/User/login';
import { MutationLoginArgs, Mutation } from '@/types/gql';
import { Form } from 'element-ui';

type Data = {
  email?: string;
  password?: string;
};
type Methods = {
  loginUser: () => void;
  validateFormAndLogin: () => void;
  passTokenToApolloClient: (result: ExecutionResult<Mutation>) => void;
};
type Computed = {
  formProps: Partial<ElFormProps<'email'|'password'>>
};

export default Vue.extend<Data, Methods, Computed, {}>({
  layout: 'auth',
  middleware: ['isUserGuest'],
  data() {
    return { email: undefined, password: undefined };
  },
  computed: {
    formProps() {
      return {
        model: { email: this.email, password: this.password },
        rules: {
          email: [
            { type: 'email', required: true, message: 'Insira um endereço de email válido' },
          ],
          password: [
            { type: 'string', required: true, message: 'O campo senha é obrigatório' },
          ],
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
        .mutate({ mutation: LoginMutationGQL, variables: loginArgs })
        .then(this.passTokenToApolloClient)
        .catch(this.$clientErrorHandler)
        .finally(() => loading.close());
    },
    async passTokenToApolloClient({ data }) {
      const authToken = data?.login?.authorization || '';
      const refreshToken = data?.login?.authorization || '';
      await this.$apolloHelpers.onLogin(authToken);
      this.$accessor.auth.setRefreshToken(refreshToken);
      this.$router.push('/dashboard');
    },
  },
});
</script>

<style lang="postcss" scoped>
.login-wrapper {
  @apply flex flex-col;
}
</style>
