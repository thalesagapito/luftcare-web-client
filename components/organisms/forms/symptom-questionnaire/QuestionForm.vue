<template lang="pug">
  el-collapse-item.question-form-wrapper(:name="question.key")
    template(slot="title"): .collapsible-item-title.drag
      .texts.no-drag
        .question-name {{ collapsibleItemTitle }}
        .success(v-if="question.isValid") (Válida)
        .error(v-else) (Inválida)
      .actions
        el-popconfirm(
          hide-icon
          title="Remover a pergunta?"
          cancelButtonText="Cancelar"
          confirmButtonText="Sim, remover"
          @onConfirm="emitDelete"
        )
          el-button(round type="text" size="mini" slot="reference" @click.stop) Remover

    el-form.px-2(v-bind="formProps" ref="form")
      .mb-7: el-form-item(label="Nome da pergunta para uso interno" prop="nameForManagement")
        .form-item-helper-text
          |Esse é o nome que será mostrado apenas no painel de controle, nenhum paciente tem acesso.
        el-input(
          autofocus
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="question.nameForManagement"
          @input="updateQuestionField('nameForManagement', $event)"
          @blur="updateQuestionField('nameForManagement', trim(question.nameForManagement))"
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
          :autosize="{ minRows: 2 }"
          @input="updateQuestionField('text', $event)"
          @blur="updateQuestionField('text', trim(question.text))"
        )

      //- .mb-7: el-form-item(label="Tipo da pergunta" prop="kind")
        el-select(
          :value="question.kind"
          @input="updateQuestionField('kind', $event)"
        )
          el-option(
            v-for="option in questionKindSelectOptions"
            :key="option.label"
            v-bind="option"
          )

      .question-choices-wrapper(v-if="isQuestionMultipleChoice")
        .header
          .title Alternativas da pergunta
          el-button(type="default" size="mini" @click="addNewChoice") Adicionar alternativa
        el-form-item.mt-2.pb-3(prop="possibleChoices")

        choices-container(
          :choices="question.possibleChoices"
          @update:choices="updateQuestionField('possibleChoices', $event)"
        )
</template>

<script lang="ts">
import Vue from 'vue';
import { Option, Form } from 'element-ui';
import { every, debounce, trim } from 'lodash';
import { RecordPropsDefinition } from 'vue/types/options';
import { ElFormProps } from '~/types/element-ui';
import { UpdateFieldWithValueFunction } from '~/types/helpers';
import { SymptomQuestionnaireQuestionKind } from '~/types/gql';
import ChoicesContainer from './QuestionChoicesContainer.vue';
import { KeyedQuestionInput, QuestionInput } from './types';
import { getDefaultQuestion, getDefaultChoice } from './factoryFunctions';


type Data = {};
type Methods = {
  emitDelete: () => void;
  addNewChoice: () => void;
  validateFormAndEmit: () => void;
  emitUpdateQuestion:(question: Props['question']) => void;
  updateQuestionField: UpdateFieldWithValueFunction<Props['question']>;
};
type Computed = {
  trim: (value: string) => string;
  collapsibleItemTitle: string;
  formProps: ElFormProps<keyof QuestionInput>;
  questionKindSelectOptions: Partial<Option>[];
  isQuestionMultipleChoice: boolean;
};
export type Props = {
  question: KeyedQuestionInput;
};
export type Events = {
  'delete-question': Props['question'];
  'update:question': Props['question'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { ChoicesContainer },
  props: {
    question: {
      type: Object,
      required: true,
      default: getDefaultQuestion,
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    trim: () => trim,
    collapsibleItemTitle() {
      const { presentationOrder, nameForManagement } = this.question;
      return `${presentationOrder}. ${nameForManagement || 'Pergunta sem nome'}`;
    },
    formProps() {
      return {
        size: 'small',
        hideRequiredAsterisk: true,
        model: {
          text: this.question.text,
          kind: this.question.kind,
          possibleChoices: this.question.possibleChoices,
          presentationOrder: this.question.presentationOrder,
          nameForManagement: this.question.nameForManagement,
        },
        rules: {
          kind: [],
          possibleChoices: [
            {
              type: 'array',
              required: this.isQuestionMultipleChoice,
              validator: (rule, value: Props['question']['possibleChoices'] = [], callback) => {
                const invalidChoicesMessage = 'Preencha todas as alternativas corretamente';
                const minLengthChoicesMessage = 'Crie pelo menos duas alternativas';

                if (!this.isQuestionMultipleChoice) return callback();

                const hasMinLengthError = value.length < 2;
                if (hasMinLengthError) return callback(minLengthChoicesMessage);

                const hasInvalidChoicesError = !every(value, 'isValid');
                if (hasInvalidChoicesError) return callback(invalidChoicesMessage);

                return callback();
              },
            },
          ],
          presentationOrder: [{
            type: 'number',
            required: true,
          }],
          text: [{
            type: 'string',
            required: true,
            max: 500,
            message: 'Obrigatório',
          }],
          nameForManagement: [{
            type: 'string',
            required: true,
            max: 500,
            message: 'Obrigatório',
          }],
        },
      };
    },
    questionKindSelectOptions() {
      return [
        { value: SymptomQuestionnaireQuestionKind.MultipleChoice, label: 'Múltipla escolha' },
        { value: SymptomQuestionnaireQuestionKind.FreeResponse, label: 'Texto livre' },
      ];
    },
    isQuestionMultipleChoice() {
      return this.question.kind === SymptomQuestionnaireQuestionKind.MultipleChoice;
    },
  },
  watch: {
    question() {
      debounce(this.validateFormAndEmit, 50)();
    },
  },
  methods: {
    emitDelete() {
      this.$emit<Events, 'delete-question'>('delete-question', this.question);
    },
    emitUpdateQuestion(question) {
      this.$emit<Events, 'update:question'>('update:question', question);
    },
    updateQuestionField(field, value) {
      const updatedQuestion = { ...this.question, [field]: value };
      this.emitUpdateQuestion(updatedQuestion);
    },
    addNewChoice() {
      const newChoice = getDefaultChoice(this.question.possibleChoices?.length || 0);
      const currentChoices = this.question.possibleChoices || [];
      const updatedQuestionChoicesArray = [...currentChoices, newChoice];

      this.updateQuestionField('possibleChoices', updatedQuestionChoicesArray);
    },
    async validateFormAndEmit() {
      const isValid = await (this.$refs.form as Form)?.validate().catch(() => false);
      if (isValid === this.question.isValid) return;
      this.emitUpdateQuestion({ ...this.question, isValid });
    },
  },
});
</script>

<style lang="postcss" scoped>
.question-form-wrapper {
  .collapsible-item-title {
    @apply flex flex-grow justify-between items-center cursor-grab;

    &:active {
      @apply cursor-grabbing;
    }

    .texts {
      @apply flex items-baseline pl-2 cursor-pointer;

      .success,
      .error {
        @apply text-xs ml-1;
      }
      .success { @apply text-success }
      .error { @apply text-danger }
    }

    .actions {
      .el-button {
        @apply mx-4;
      }
    }
  }

  & >>> > div[role="tab"],
  & >>> > div[role="tabpanel"] {
    @apply relative;
  }

  .question-choices-wrapper {
    .header {
      @apply flex items-center;
      .title {
        @apply font-bold text-gray-700 mr-2;
      }
    }
  }
}
</style>
