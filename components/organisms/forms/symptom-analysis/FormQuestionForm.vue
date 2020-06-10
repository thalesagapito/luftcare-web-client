<template lang="pug">
  el-form.question-form-wrapper(v-bind="formProps")
    .mb-7: el-form-item(label="Ordem da pergunta" prop="presentationOrder")
      .form-item-helper-text
        |Posição em que a pergunta vai aparecer no formulário
      el-input-number(
        :min="1"
        :max="maxPresentationOrder"
        :value="question.presentationOrder"
        @change="updateQuestionPresentationOrder($event)"
      )

    .mb-7: el-form-item(label="Nome da pergunta para uso interno" prop="nameForManagement")
      .form-item-helper-text
        |Esse é o nome que será mostrado apenas no painel de controle, nenhum paciente tem acesso.
      el-input(
        autofocus
        type="text"
        maxlength="500"
        placeholder="Digite aqui"
        :value="question.nameForManagement"
        @input="updateQuestionField($event, 'nameForManagement')"
      )

    .mb-7: el-form-item(label="Enunciado da pergunta" prop="text")
      .form-item-helper-text
        |O enunciado da pergunta que será mostrado ao paciente.
      el-input(
        show-word-limit
        type="textarea"
        maxlength="500"
        placeholder="Digite aqui"
        :value="question.text"
        :autosize="{ minRows: 4 }"
        @input="updateQuestionField($event, 'text')"
      )
    pre {{ question }}
</template>

<script lang="ts">
import Vue from 'vue';
import { RecordPropsDefinition } from 'vue/types/options';
import { ElFormProps } from '~/types/element-ui';
import { CreateSymptomAnalysisFormQuestionInput, SymptomAnalysisFormQuestionKind } from '~/types/gql';

type Data = {};
type Methods = {
  updateQuestionField: (value: string, fieldName: keyof Props['question']) => void;
  updateQuestionPresentationOrder: (newPresentationOrder: number) => void;
};
type Computed = {
  formProps: Partial<ElFormProps<keyof CreateSymptomAnalysisFormQuestionInput>>;
};
export type Props = {
  question: CreateSymptomAnalysisFormQuestionInput;
  maxPresentationOrder: number;
};
export type Events = {
  'update-presentation-order': { oldPresentationOrder: number; newPresentationOrder: number };
  'update:question': CreateSymptomAnalysisFormQuestionInput;
};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    question: {
      type: Object,
      required: true,
      default: () => ({
        text: '',
        possibleChoices: [],
        presentationOrder: 1,
        nameForManagement: '',
        kind: SymptomAnalysisFormQuestionKind.FreeResponse,
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
        model: {
          text: this.question.text,
          kind: this.question.kind,
          possibleChoices: this.question.possibleChoices,
          presentationOrder: this.question.presentationOrder,
          nameForManagement: this.question.nameForManagement,
        },
        rules: {
          kind: [],
          possibleChoices: [],
          presentationOrder: [{ type: 'number', required: true }],
          text: [{
            type: 'string', required: true, max: 500, message: 'Obrigatório',
          }],
          nameForManagement: [{
            type: 'string', required: true, max: 500, message: 'Obrigatório',
          }],
        },
      };
    },
  },
  methods: {
    updateQuestionField(value: string, fieldName: keyof Props['question']) {
      const newQuestionValue = { ...this.question, [fieldName]: value };
      this.$emit<Events, 'update:question'>('update:question', newQuestionValue);
    },
    updateQuestionPresentationOrder(newPresentationOrder: number) {
      const eventArgs = {
        oldPresentationOrder: this.question.presentationOrder,
        newPresentationOrder,
      };
      this.$emit<Events, 'update-presentation-order'>('update-presentation-order', eventArgs);
    },
  },
});
</script>

<style lang="postcss" scoped>
.question-form-wrapper {
}
</style>
