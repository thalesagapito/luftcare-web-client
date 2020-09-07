<template lang="pug">
  el-collapse-item.score-range-form-wrapper(:name="scoreRange.presentationOrder")
    template(slot="title"): .collapsible-item-title
      .texts
        .score-range-name {{ friendlyScoreRangeName || 'Intervalo' }}
        .success(v-if="scoreRange.isValid") (Válido)
        .error(v-else) (Inválido)
      .actions
        el-popconfirm(
          hide-icon
          title="Remover o intervalo?"
          cancelButtonText="Cancelar"
          confirmButtonText="Sim, remover"
          @onConfirm="emitDelete"
        )
          el-button(round type="text" size="mini" slot="reference" @click.stop) Remover

    el-form.px-1(v-bind="formProps" ref="form")
      .mb-7: el-form-item(label="Nome da pergunta para uso interno" prop="nameForManagement")
        .form-item-helper-text
          |Esse é o nome que será mostrado apenas no painel de controle, nenhum paciente tem acesso.
        el-input(
          autofocus
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="scoreRange.nameForManagement"
          @input="updateScoreRangeField('nameForManagement', $event)"
        )

      .mb-7: el-form-item(label="Enunciado da pergunta" prop="text")
        .form-item-helper-text
          |O enunciado da pergunta que será mostrado ao paciente.
        el-input(
          show-word-limit
          type="textarea"
          maxlength="500"
          placeholder="Digite aqui"
          :value="scoreRange.text"
          :autosize="{ minRows: 4 }"
          @input="updateScoreRangeField('text', $event)"
        )

      .mb-7: el-form-item(label="Tipo da pergunta" prop="kind")
        el-select(
          :value="scoreRange.kind"
          @input="updateScoreRangeField('kind', $event)"
        )

</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from 'lodash';
import { Form } from 'element-ui';
import { ElFormProps } from '@/types/element-ui';
import { RecordPropsDefinition } from 'vue/types/options';
import { UpdateFieldWithValueFunction } from '@/types/helpers';
import { getDefaultScoreRange } from './factoryFunctions';
import { KeyedScoreRangeInput, ScoreRangeInput } from './types';


type Data = {};
type Methods = {
  emitDelete: () => void;
  validateFormAndEmit: () => void;
  emitUpdateScoreRange:(scoreRange: Props['scoreRange']) => void;
  updateScoreRangeField: UpdateFieldWithValueFunction<Props['scoreRange']>;
};
type Computed = {
  friendlyScoreRangeName: string;
  formProps: ElFormProps<keyof ScoreRangeInput>;
};
export type Props = {
  scoreRange: KeyedScoreRangeInput;
};
export type Events = {
  'delete-score-range': Props['scoreRange'];
  'update:scoreRange': Props['scoreRange'];
};

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    scoreRange: {
      type: Object,
      required: true,
      default: getDefaultScoreRange,
    },
  } as RecordPropsDefinition<Props>,
  computed: {
    friendlyScoreRangeName() {
      const { minScore = 0, maxScore = 0 } = this.scoreRange;
      return `De ${minScore} até ${maxScore} pontos`;
    },
    formProps() {
      return {
        size: 'small',
        hideRequiredAsterisk: true,
        model: {
          minScore: this.scoreRange.minScore,
          maxScore: this.scoreRange.maxScore,
          color: this.scoreRange.color,
          title: this.scoreRange.title,
          description: this.scoreRange.description,
        },
        rules: {
          minScore: [{
            type: 'integer',
            required: true,
            message: 'Obrigatório',
          }],
          maxScore: [{
            type: 'integer',
            required: true,
            message: 'Obrigatório',
          }],
          color: [{
            required: true,
          }],
          title: [{
            type: 'string',
            required: true,
            max: 500,
            message: 'Obrigatório',
          }],
          description: [{
            type: 'string',
            required: true,
            max: 2000,
            message: 'Obrigatório',
          }],
          // possibleChoices: [
          //   {
          //     type: 'array',
          //     required: this.isScoreRangeMultipleChoice,
          //     validator: (rule, value: Props['scoreRange']['possibleChoices'] = [], callback) => {
          //       const invalidChoicesMessage = 'Preencha todas as alternativas corretamente';
          //       const minLengthChoicesMessage = 'Crie pelo menos duas alternativas';

          //       if (!this.isScoreRangeMultipleChoice) return callback();

          //       const hasMinLengthError = value.length < 2;
          //       if (hasMinLengthError) return callback(minLengthChoicesMessage);

          //       const hasInvalidChoicesError = !every(value, 'isValid');
          //       if (hasInvalidChoicesError) return callback(invalidChoicesMessage);

          //       return callback();
          //     },
          //   },
          // ],
        },
      };
    },
  },
  watch: {
    scoreRange() {
      debounce(this.validateFormAndEmit, 50)();
    },
  },
  methods: {
    emitDelete() {
      this.$emit<Events, 'delete-score-range'>('delete-score-range', this.scoreRange);
    },
    emitUpdateScoreRange(scoreRange) {
      this.$emit<Events, 'update:scoreRange'>('update:scoreRange', scoreRange);
    },
    updateScoreRangeField(field, value) {
      const updatedScoreRange = { ...this.scoreRange, [field]: value };
      this.emitUpdateScoreRange(updatedScoreRange);
    },
    async validateFormAndEmit() {
      const isValid = await (this.$refs.form as Form)?.validate().catch(() => false);
      if (isValid === this.scoreRange.isValid) return;
      this.emitUpdateScoreRange({ ...this.scoreRange, isValid });
    },
  },
});
</script>

<style lang="postcss" scoped>
.score-range-form-wrapper {
  .collapsible-item-title {
    @apply flex flex-grow justify-between items-center;

    .texts {
      @apply flex items-baseline;

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
      & >>> .el-input-number {
        @apply w-18;
        transform: rotateX(180deg);

        input {
          @apply pl-1 pr-9;
          transform: rotateX(180deg);
        }
      }
    }
  }

  & >>> > div[role="tab"],
  & >>> > div[role="tabpanel"] {
    @apply relative;
  }

  .scoreRange-choices-wrapper {
    .header {
      @apply flex items-center;
      .title {
        @apply font-bold text-gray-700 mr-2;
      }
    }
  }
}
</style>
