<template lang="pug">
  .questionnaire-form-wrapper
    .form-section-title.mb-6 Dados do questionário

    el-form(v-bind="formProps" ref="form")
      .mb-7: el-form-item(label="Nome do questionário para uso interno" prop="nameForManagement")
        .form-item-helper-text
          |Esse é o nome que será mostrado apenas no painel de controle, nenhum paciente tem acesso.
        el-input(
          autofocus
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="value.nameForManagement"
          @input="updateQuestionnaireField('nameForManagement', $event)"
        )

      .mb-7: el-form-item(label="Nome do questionário para os pacientes" prop="nameForPresentation")
        .form-item-helper-text
          |Esse nome será mostrado aos pacientes,
          |é recomendado escolher um nome de fácil entendimento.
        el-input(
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="value.nameForPresentation"
          @input="updateQuestionnaireField('nameForPresentation', $event)"
        )

      el-form-item(label="Visibilidade" prop="isPublished")
        .form-item-helper-text.mb-0
          |Recomendamos criar um questionário privado inicialmente,
          |e após revisar as perguntas e alternativas torná-lo público.
        el-radio(
          :label="false"
          :value="value.isPublished"
          @input="updateQuestionnaireField('isPublished', $event)"
        ) Privado
        el-radio(
          :label="true"
          :value="value.isPublished"
          @input="updateQuestionnaireField('isPublished', $event)"
        ) Público


      .form-section-title.mt-4.mb-2
        div Perguntas do questionário
        .questions-error: el-form-item(prop="questions")

      questions-container(
        :questions="value.questions"
        @update:questions="updateQuestionnaireField('questions', $event)"
      )

      .form-section-title.mt-5.mb-2
        div Intervalos de pontuação
        div (TODO)
</template>

<script lang="ts">
import Vue from 'vue';
import { every } from 'lodash';
import { Form } from 'element-ui';
import { ElFormProps } from '@/types/element-ui';
import { RecordPropsDefinition } from 'vue/types/options';
import { UpdateFieldWithValueFunction } from '@/types/helpers';
import { KeyedQuestionnaireInput } from './types';
import QuestionsContainer from './QuestionsContainer.vue';

type Data = {};
type Methods = {
  emitInput: (value: Props['value']) => void;
  updateQuestionnaireField: UpdateFieldWithValueFunction<Props['value']>;
};
type Computed = {
  formProps: ElFormProps<keyof Props['value']>;
};
export type Props = {
  value: KeyedQuestionnaireInput;
  isValid: boolean;
};
export type Events = {
  input: Props['value'];
  'update:isValid': Props['isValid'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  components: {
    QuestionsContainer,
  },
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
        questions: [],
        scoreRanges: [],
        isPublished: false,
        nameForManagement: '',
        nameForPresentation: '',
      }),
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    formProps() {
      return {
        hideRequiredAsterisk: true,
        model: {
          nameForManagement: this.value.nameForManagement,
          nameForPresentation: this.value.nameForPresentation,
          isPublished: this.value.isPublished,
          questions: this.value.questions,
          scoreRanges: this.value.scoreRanges,
        },
        rules: {
          nameForManagement: [{
            max: 500,
            type: 'string',
            required: true,
            message: 'Obrigatório',
          }],
          nameForPresentation: [{
            max: 500,
            type: 'string',
            required: true,
            message: 'Obrigatório',
          }],
          isPublished: [{ type: 'boolean', required: true }],
          questions: [
            {
              type: 'array',
              required: true,
              validator: (rule, value: Props['value']['questions'] = [], callback) => {
                const invalidQuestionsMessage = 'Preencha todas as perguntas corretamente';
                const minLengthQuestionsMessage = 'Crie pelo menos uma pergunta';

                const hasMinLengthError = value.length < 1;
                if (hasMinLengthError) return callback(minLengthQuestionsMessage);

                const hasInvalidQuestionsError = !every(value, 'isValid');
                if (hasInvalidQuestionsError) return callback(invalidQuestionsMessage);

                return callback();
              },
            },
          ],
          scoreRanges: [
            {
              type: 'array',
              required: true,
              validator: (rule, value: Props['value']['scoreRanges'] = [], callback) => {
                const invalidScoreRangesMessage = 'Preencha todos os intervalos de pontuação corretamente';
                const minLengthScoreRangesMessage = 'Crie pelo menos um intervalo de pontuação';

                const hasMinLengthError = value.length < 1;
                if (hasMinLengthError) return callback(minLengthScoreRangesMessage);

                const hasInvalidScoreRangesError = !every(value, 'isValid');
                if (hasInvalidScoreRangesError) return callback(invalidScoreRangesMessage);

                return callback();
              },
            },
          ],
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
    updateQuestionnaireField(field, value) {
      const updatedQuestionnaire = { ...this.value, [field]: value };
      this.emitInput(updatedQuestionnaire);
    },
  },
});
</script>

<style lang="postcss" scoped>
.questionnaire-form-wrapper {
  .form-section-title {
    @apply text-lg font-semibold text-gray-800 flex items-baseline;
  }

  .questions-error {
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
