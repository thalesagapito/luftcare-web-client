<template lang="pug">
  .question-choice-form-wrapper
    el-form(v-bind="formProps" ref="form")
      .inner-container
        .left
          el-form-item(label="Nome para uso interno" prop="nameForManagement")
            el-input(
              autofocus
              type="text"
              maxlength="500"
              placeholder="Digite aqui"
              :value="choice.nameForManagement"
              @input="updateChoiceField($event, 'nameForManagement')"
            )

          el-form-item(label="Enunciado da alternativa" prop="text")
            el-input(
              show-word-limit
              type="textarea"
              maxlength="500"
              placeholder="Digite aqui"
              :value="choice.text"
              :autosize="{ minRows: 3 }"
              @input="updateChoiceField($event, 'text')"
            )

          el-form-item(label="Pontuação" prop="value")
            .form-item-helper-text
              |Se essa alternativa for selecionada,
              |esse é o valor dela no cálculo do resultado do formulário
            el-input-number(
              :value="choice.value"
              @input="updateChoiceField($event, 'value')"
            )
        .right
          el-form-item(label="Ordem" prop="presentationOrder")
            number-stepper(
              is-inverted
              :minValue="1"
              :maxValue="maxPresentationOrder"
              :value="choice.presentationOrder"
              @input="updateChoicePresentationOrder($event)"
            )
          el-button(
            plain
            size="mini"
            type="danger"
            @click="emitDeleteChoice"
          ) Remover
</template>

<script lang="ts">
import Vue from 'vue';
import { Form } from 'element-ui';
import { debounce } from 'lodash';
import { RecordPropsDefinition } from 'vue/types/options';
import { ElFormProps } from '@/types/element-ui';
import NumberStepper from '@/components/atoms/controls/VerticalNumberStepper.vue';
import { KeyedChoiceInput, ChoiceInput } from './types';
import { getDefaultChoice } from './factoryFunctions';

type Data = {};
type Methods = {
  emitDeleteChoice: () => void;
  validateFormAndEmit: () => void;
  emitUpdateChoice: (updatedChoice: Props['choice']) => void;
  updateChoiceField: (value: any, fieldName: keyof Props['choice']) => void;
  updateChoicePresentationOrder: (newPresentationOrder: number) => void;
};
type Computed = {
  formProps: ElFormProps<keyof ChoiceInput>;
};
export type Props = {
  choice: KeyedChoiceInput;
  maxPresentationOrder: number;
};
export type Events = {
  'update-presentation-order': { oldPresentationOrder: number; newPresentationOrder: number };
  'update:choice': Props['choice'];
  'delete-choice': Props['choice'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { NumberStepper },
  props: {
    choice: {
      type: Object,
      required: true,
      default: getDefaultChoice,
    },
    maxPresentationOrder: {
      type: Number,
      required: true,
      default: 1,
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    formProps() {
      return {
        showMessage: true,
        size: 'mini',
        hideRequiredAsterisk: true,
        model: {
          text: this.choice.text,
          value: this.choice.value,
          nameForManagement: this.choice.nameForManagement,
          presentationOrder: this.choice.presentationOrder,
        },
        rules: {
          text: [{
            type: 'string',
            required: true,
            max: 500,
            message: 'Obrigatório',
          }],
          value: [{
            type: 'number',
            required: true,
          }],
          nameForManagement: [{
            type: 'string',
            required: true,
            max: 500,
            message: 'Obrigatório',
          }],
          presentationOrder: [],
        },
      };
    },
  },
  watch: {
    choice() {
      debounce(this.validateFormAndEmit, 50)();
    },
  },
  methods: {
    emitUpdateChoice(updatedChoice) {
      this.$emit<Events, 'update:choice'>('update:choice', updatedChoice);
    },
    updateChoiceField(value, fieldName) {
      const updatedChoice = { ...this.choice, [fieldName]: value };
      this.emitUpdateChoice(updatedChoice);
    },
    updateChoicePresentationOrder(newPresentationOrder) {
      const eventArgs = {
        oldPresentationOrder: this.choice.presentationOrder,
        newPresentationOrder,
      };
      this.$emit<Events, 'update-presentation-order'>('update-presentation-order', eventArgs);
    },
    emitDeleteChoice() {
      this.$emit<Events, 'delete-choice'>('delete-choice', this.choice);
    },
    async validateFormAndEmit() {
      const isValid = await (this.$refs.form as Form)?.validate().catch(() => false);
      if (isValid === this.choice.isValid) return;
      this.emitUpdateChoice({ ...this.choice, isValid });
    },
  },
});
</script>

<style lang="postcss" scoped>
.question-choice-form-wrapper {
  @apply border-gray-300 border-1 rounded-lg p-4 bg-white;

  .inner-container {
    @apply flex;

    .left {
      @apply flex-1;
      .el-form-item:last-of-type {
        @apply mb-0;
      }
    }
    .left,
    .right {
      @apply flex flex-col;
    }

    .right {
      @apply justify-between items-center ml-6 pl-6 border-l-1 border-gray-200;

      .el-form-item {
        @apply flex flex-col items-center;
      }

      & >>> .el-form-item__label {
        @apply pr-0;
      }
    }
  }
}
</style>
