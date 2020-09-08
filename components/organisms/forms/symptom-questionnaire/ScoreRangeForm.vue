<template lang="pug">
  el-collapse-item.score-range-form-wrapper(:name="scoreRange.key")
    template(slot="title"): .collapsible-item-title
      .texts
        .score-range-name {{ friendlyScoreRangeName }}
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

    el-form.px-2(v-bind="formProps" ref="form")
      el-form-item(label="Pontuação para atingir o intervalo")
        el-slider.slider(
          :value="[scoreRange.minScore, scoreRange.maxScore]"
          :disabled="minPossibleScoreIsSameAsMax"
          :min="minQuestionnaireScore"
          :max="maxQuestionnaireScore"
          :show-tooltip="false"
          :marks="[]"
          show-stops
          range
          @input="updateMinAndMaxScore"
        )
        .text-danger.text-sm(v-if="minPossibleScoreIsSameAsMax")
          |Preencha as perguntas e alternativas do questionário primeiro

      .mb-5: el-form-item(label="Nome do intervalo" prop="title")
        .form-item-helper-text
          |Mostrado aos pacientes ao atingir a pontuação, "Bom", "Muito bom", etc.
        el-input(
          autofocus
          type="text"
          maxlength="500"
          placeholder="Digite aqui"
          :value="scoreRange.title"
          @input="updateScoreRangeField('title', $event)"
        )

      .mb-5: el-form-item(label="Descrição do intervalo" prop="description")
        .form-item-helper-text
          |Mostrado aos pacientes ao atingir a pontuação, pode conter instruções, avisos, encorajamento, etc.
        el-input(
          show-word-limit
          type="textarea"
          maxlength="2000"
          placeholder="Digite aqui"
          :value="scoreRange.description"
          :autosize="{ minRows: 3 }"
          @input="updateScoreRangeField('description', $event)"
        )

      .mb-5: el-form-item(label="Cor do intervalo" prop="color")
        .form-item-helper-text
          |Mostrado aos pacientes ao atingir a pontuação, para facilitar o entendimento da situação.
        el-radio-group(
          :value="scoreRange.color"
          size="small"
          @input="updateScoreRangeField('color', $event)"
        )
          el-radio-button(
            v-for="color in colorOptions"
            :class="color.class"
            :label="color.value"
            :name="color.label"
            :key="color.value"
          ) {{ color.label }}
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
import { SymptomQuestionnaireScoreRangeColor } from '~/types/gql';

type ColorOption = {
  value: SymptomQuestionnaireScoreRangeColor;
  label: string;
  class: string;
};

type Data = {};
type Methods = {
  emitDelete: () => void;
  validateFormAndEmit: () => void;
  updateMinAndMaxScore: (minAndMaxScore: [number, number]) => void;
  emitUpdateScoreRange:(scoreRange: Props['scoreRange']) => void;
  updateScoreRangeField: UpdateFieldWithValueFunction<Props['scoreRange']>;
};
type Computed = {
  colorOptions: ColorOption[];
  friendlyScoreRangeName: string;
  minPossibleScoreIsSameAsMax: boolean;
  formProps: ElFormProps<keyof ScoreRangeInput>;
};
export type Props = {
  scoreRange: KeyedScoreRangeInput;
  minQuestionnaireScore: number;
  maxQuestionnaireScore: number;
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
      default: () => getDefaultScoreRange([], { minScore: 0, maxScore: 0 }),
    },
    minQuestionnaireScore: { type: Number, required: true, default: 0 },
    maxQuestionnaireScore: { type: Number, required: true, default: 0 },
  } as RecordPropsDefinition<Props>,
  computed: {
    colorOptions() {
      return [
        {
          label: 'Vermelho',
          class: 'red',
          value: SymptomQuestionnaireScoreRangeColor.Red,
        },
        {
          label: 'Laranja',
          class: 'orange',
          value: SymptomQuestionnaireScoreRangeColor.Orange,
        },
        {
          label: 'Amarelo',
          class: 'yellow',
          value: SymptomQuestionnaireScoreRangeColor.Yellow,
        },
        {
          label: 'Amarelo-verde',
          class: 'green-yellow',
          value: SymptomQuestionnaireScoreRangeColor.GreenYellow,
        },
        {
          label: 'Verde',
          class: 'green',
          value: SymptomQuestionnaireScoreRangeColor.Green,
        },
      ];
    },
    friendlyScoreRangeName() {
      const { title, minScore = 0, maxScore = 0 } = this.scoreRange;
      const isSingular = Math.abs(maxScore) <= 1;
      const isIntervalExact = minScore === maxScore;
      const formattedTitle = title || 'Intervalo sem nome';
      const formattedPoints = isSingular ? 'ponto' : 'pontos';

      if (isIntervalExact) return `${formattedTitle}, exatamente ${maxScore} ${formattedPoints}`;

      return `${formattedTitle}, de ${minScore} até ${maxScore} ${formattedPoints}`;
    },
    minPossibleScoreIsSameAsMax() {
      return this.minQuestionnaireScore === this.maxQuestionnaireScore;
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
    updateMinAndMaxScore([minScore, maxScore]) {
      const updatedMinScore = this.scoreRange.minScore !== minScore;
      const updatedMaxScore = this.scoreRange.maxScore !== maxScore;

      if (updatedMinScore) this.updateScoreRangeField('minScore', minScore);
      if (updatedMaxScore) this.updateScoreRangeField('maxScore', maxScore);
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
      @apply flex items-baseline pl-2;

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

  .slider {
    @apply px-5 mt-1;
  }

  .el-radio-button >>> span,
  .slider >>> .el-slider__runway .el-slider__bar,
  .slider >>> .el-slider__runway .el-slider__button-wrapper {
    @apply transition-all duration-200 ease-out;
  }

  .el-radio-button {
    &.is-active {
      & >>> span {
        @apply shadow-none;
      }
      &.red >>> span {
        @apply bg-red-500 border-red-500;
      }
      &.orange >>> span {
        @apply bg-orange-500 border-orange-500;
      }
      &.yellow >>> span {
        @apply bg-yellow-500 border-yellow-500;
      }
      &.green-yellow >>> span {
        @apply bg-green-yellow border-green-yellow;
      }
      &.green >>> span {
        @apply bg-green-500 border-green-500;
      }
    }
  }

}
</style>
