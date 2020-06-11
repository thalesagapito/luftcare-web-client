<template lang="pug">
  .question-choice-form-wrapper
    //- pre {{ choice }}
    el-form(v-bind="formProps")
      .inner-container
        .left
          el-form-item(label="Nome da alternativa para uso interno" prop="nameForManagement")
            el-input(
              autofocus
              type="text"
              maxlength="500"
              placeholder="Digite aqui"
              :value="choice.nameForManagement"
              @input="updateChoiceField($event, 'nameForManagement')"
            )

          el-form-item.choice-text(label="Enunciado da alternativa" prop="text")
            el-input(
              show-word-limit
              type="textarea"
              maxlength="500"
              placeholder="Digite aqui"
              :value="choice.text"
              :autosize="{ minRows: 3 }"
              @input="updateChoiceField($event, 'text')"
            )
        .right
          el-form-item(label="Ordem da alternativa" prop="presentationOrder")
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
          ) Remover alternativa
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';
import NumberStepper from '~/components/atoms/controls/VerticalNumberStepper.vue';
import { ElFormProps } from '~/types/element-ui';
import { CreateSymptomQuestionnaireQuestionChoiceInput } from '~/types/gql';

type Data = {};
type Methods = {
  emitDeleteChoice: () => void;
  updateChoiceField: (value: any, fieldName: keyof Props['choice']) => void;
  updateChoicePresentationOrder: (newPresentationOrder: number) => void;
};
type Computed = {
  formProps: ElFormProps<keyof CreateSymptomQuestionnaireQuestionChoiceInput>;
};
export type Props = {
  choice: CreateSymptomQuestionnaireQuestionChoiceInput;
  maxPresentationOrder: number;
};
export type Events = {
  'update-presentation-order': { oldPresentationOrder: number; newPresentationOrder: number };
  'update:choice': CreateSymptomQuestionnaireQuestionChoiceInput;
  'delete-choice': CreateSymptomQuestionnaireQuestionChoiceInput
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { NumberStepper },
  props: {
    choice: {
      type: Object,
      required: true,
      default: () => ({
        nameForManagement: '',
        presentationOrder: 1,
        text: '',
        value: 1,
      }),
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
        size: 'mini',
        model: {
          text: this.choice.text,
          value: this.choice.value,
          nameForManagement: this.choice.nameForManagement,
          presentationOrder: this.choice.presentationOrder,
        },
        rules: {
          text: [],
          value: [],
          nameForManagement: [],
          presentationOrder: [],
        },
      };
    },
  },
  methods: {
    updateChoiceField(value: any, fieldName: keyof Props['choice']) {
      const newQuestionValue = { ...this.choice, [fieldName]: value };
      this.$emit<Events, 'update:choice'>('update:choice', newQuestionValue);
    },
    updateChoicePresentationOrder(newPresentationOrder: number) {
      const eventArgs = {
        oldPresentationOrder: this.choice.presentationOrder,
        newPresentationOrder,
      };
      this.$emit<Events, 'update-presentation-order'>('update-presentation-order', eventArgs);
    },
    emitDeleteChoice() {
      this.$emit<Events, 'delete-choice'>('delete-choice', this.choice);
    },
  },
});
</script>

<style lang="postcss" scoped>
.question-choice-form-wrapper {
  @apply border-gray-300 border-1 rounded-lg px-4 pt-3 pb-4;

  .inner-container {
    @apply flex;

    .left {
      @apply flex-1;
      .el-form-item.choice-text {
        @apply mb-0;
      }
    }
    .left,
    .right {
      @apply flex flex-col;
    }

    .right {
      @apply justify-between items-end ml-6 pl-6 border-l-1 border-gray-200;

      .el-form-item {
        @apply flex flex-col items-end;
      }

      & >>> .el-form-item__label {
        @apply pr-0;
      }
    }
  }
}
</style>
