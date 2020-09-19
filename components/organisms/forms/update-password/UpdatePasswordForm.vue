<template lang="pug">
  .update-password-wrapper
    el-form(v-bind="formProps" ref="form")
      input.invisible(type="email" :value="currentUserEmail")
      .mb-6: el-form-item(label="Senha atual" prop="currentPassword")
        .form-item-helper-text É necessário informar a sua senha atual por segurança.
        el-input(
          type="password"
          placeholder="Digite aqui"
          autocomplete="current-password"
          :value="value.currentPassword"
          @input="updateDataField('currentPassword', $event)"
          @blur="updateDataField('currentPassword', trim(value.currentPassword))"
        )

      .mb-6: el-form-item(label="Nova senha" prop="newPassword")
        .form-item-helper-text Deve ter no mínimo 6 caracteres.
        .flex
          el-input(
            :type="newPasswordFieldType"
            minlength="6"
            maxlength="500"
            placeholder="Digite aqui"
            autocomplete="new-password"
            :value="value.newPassword"
            @input="updateDataField('newPassword', $event)"
            @blur="updateDataField('newPassword', trim(value.newPassword))"
          )
          .w-2
          el-button(@click="toggleNewPasswordVisibility") {{ toggleNewPasswordVisibilityText }}
</template>

<script lang="ts">
import Vue from 'vue';
import { trim } from 'lodash';
import { Form } from 'element-ui';
import { ElFormProps } from '@/types/element-ui';
import { MutationUpdatePasswordArgs } from '@/types/gql';
import { RecordPropsDefinition } from 'vue/types/options';
import { UpdateFieldWithValueFunction } from '@/types/helpers';

type Data = {
  isNewPasswordVisible: boolean;
};
type Methods = {
  emitInput: (value: Props['value']) => void;
  updateDataField: UpdateFieldWithValueFunction<Props['value']>;
  toggleNewPasswordVisibility: () => void;
};
type Computed = {
  trim: (value: string) => string;
  newPasswordFieldType: string;
  toggleNewPasswordVisibilityText: string;
  formProps: ElFormProps<keyof Props['value']>;
};
export type Props = {
  value: MutationUpdatePasswordArgs;
  /** This is needed to trigger the chrome "update email and password" dialog correctly */
  currentUserEmail: string;
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
        currentPassword: '',
        newPassword: '',
      }),
    },
    currentUserEmail: {
      type: String,
      required: true,
      default: '',
    },
  } as RecordPropsDefinition<Props>,
  data() {
    return {
      isNewPasswordVisible: false,
    };
  },
  computed: {
    trim: () => trim,
    newPasswordFieldType() {
      return this.isNewPasswordVisible ? 'text' : 'password';
    },
    toggleNewPasswordVisibilityText() {
      return this.isNewPasswordVisible ? 'Esconder' : 'Mostrar';
    },
    formProps() {
      return {
        hideRequiredAsterisk: true,
        model: {
          currentPassword: this.value.currentPassword,
          newPassword: this.value.newPassword,
        },
        rules: {
          currentPassword: [{
            type: 'string',
            required: true,
            message: 'Insira a sua senha atual',
          }],
          newPassword: [{
            min: 6,
            max: 500,
            type: 'string',
            required: true,
            message: 'Insira uma senha com pelo menos 6 caracteres',
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
    updateDataField(field, value) {
      const updatedData = { ...this.value, [field]: value };
      this.emitInput(updatedData);
    },
    toggleNewPasswordVisibility() {
      this.isNewPasswordVisible = !this.isNewPasswordVisible;
    },
  },
});
</script>

<style lang="postcss" scoped>
.update-password-wrapper {
  .form-section-title {
    @apply text-lg font-semibold text-gray-800 flex items-baseline;
  }

  .form-item-helper-text {
    @apply text-sm text-gray-500 leading-none mt-1 mb-2;
  }
}
</style>
