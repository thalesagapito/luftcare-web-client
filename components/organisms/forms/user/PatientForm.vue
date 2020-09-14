<template lang="pug">
  .patient-form-wrapper
    .form-section-title.mb-6 Dados do questionário

    el-form(v-bind="formProps" ref="form")
      .mb-6: el-form-item(label="Email do paciente" prop="email")
        .form-item-helper-text
          |<strong>Não poderá</strong> ser alterado pelo paciente.
          |É esse email será usado para entrar no aplicativo.
        el-input(
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="value.email"
          @input="updatePatientField('email', $event)"
          @blur="updatePatientField('email', trim(value.email))"
        )

      .mb-6: el-form-item(label="Senha provisória da conta" prop="password")
        .form-item-helper-text
          |<strong>Deve</strong> ser alterada pelo paciente.
        el-input(
          type="text"
          minlength="6"
          maxlength="500"
          placeholder="Digite aqui"
          :value="value.password"
          @input="updatePatientField('password', $event)"
          @blur="updatePatientField('password', trim(value.password))"
        )

      .mb-6: el-form-item(label="Nome do paciente" prop="name")
        .form-item-helper-text
          |Pode ser alterado mais tarde pelo paciente.
        el-input(
          autofocus
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="value.name"
          @input="updatePatientField('name', $event)"
          @blur="updatePatientField('name', trim(value.name))"
        )

      .mb-6: el-form-item(label="Telefone do paciente" prop="phoneNumber")
        .form-item-helper-text
          |Pode ser alterado mais tarde pelo paciente.
        el-input(
          autofocus
          type="text"
          maxlength="20"
          placeholder="(41) 98765-4321"
          v-model="maskedPhoneNumber"
        )
</template>

<script lang="ts">
import Vue from 'vue';
import msk from 'msk';
import { Form } from 'element-ui';
import { trim } from 'lodash';
import { ElFormProps } from '@/types/element-ui';
import { CreateUserInput } from '@/types/gql';
import { RecordPropsDefinition } from 'vue/types/options';
import { UpdateFieldWithValueFunction } from '@/types/helpers';

type Data = {};
type Methods = {
  emitInput: (value: Props['value']) => void;
  updatePatientField: UpdateFieldWithValueFunction<Props['value']>;
};
type Computed = {
  trim: (value: string) => string;
  maskedPhoneNumber: string;
  formProps: ElFormProps<keyof Props['value']>;
};
export type Props = {
  value: Pick<CreateUserInput, 'name' | 'email' | 'password' | 'phoneNumber'>;
  isValid: boolean;
};
export type Events = {
  input: Props['value'];
  'update:isValid': Props['isValid'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    isValid: {
      type: Boolean,
      required: true,
      default: false,
    },
    value: {
      type: Object,
      required: true,
      default: () => ({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
      }),
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    trim: () => trim,
    maskedPhoneNumber: {
      get() {
        return this.value.phoneNumber;
      },
      set(value = '') {
        const eightDigitPhoneMask = '(99) 9999-9999';
        const nineDigitPhoneMask = '(99) 99999-9999';
        const mask = value.length >= 15 ? nineDigitPhoneMask : eightDigitPhoneMask;
        const maskedValue = msk.fit(value, mask);
        this.updatePatientField('phoneNumber', maskedValue);
      },
    },
    formProps() {
      return {
        hideRequiredAsterisk: true,
        model: {
          name: this.value.name,
          email: this.value.email,
          password: this.value.password,
          phoneNumber: this.value.phoneNumber,
        },
        rules: {
          name: [{
            max: 500,
            type: 'string',
            required: true,
            message: 'Obrigatório',
          }],
          email: [{
            max: 500,
            type: 'email',
            required: true,
            message: 'Insira um endereço de email válido',
          }],
          password: [{
            min: 6,
            max: 500,
            type: 'string',
            required: true,
            message: 'Insira uma senha com no mínimo 6 caracteres',
          }],
          phoneNumber: [{
            max: 20,
            type: 'string',
            required: true,
            message: 'Insira um telefone ou celular válido',
          }],
        },
      };
    },
  },
  methods: {
    emitInput(updatedData) {
      this.$emit<Events, 'input'>('input', updatedData);
      this.$nextTick(() => {
        const { form } = this.$refs;
        if (!form) return;

        (form as Form).validate((newIsValid) => {
          if (newIsValid !== this.isValid) {
            this.$emit<Events, 'update:isValid'>('update:isValid', newIsValid);
          }
        });
      });
    },
    updatePatientField(field, value) {
      const updatedPatient = { ...this.value, [field]: value };
      this.emitInput(updatedPatient);
    },
  },
});
</script>

<style lang="postcss" scoped>
.patient-form-wrapper {
  .form-section-title {
    @apply text-lg font-semibold text-gray-800 flex items-baseline;
  }

  .phonenumber-error {
    @apply ml-2;

    & >>> .el-form-item::before,
    & >>> .el-form-item__content::before {
      @apply hidden;
    }
    & >>> .el-form-item__error { @apply static }
  }

  & >>> .form-item-helper-text {
    @apply text-sm text-gray-500 leading-none mt-1 mb-2;
  }
}
</style>
