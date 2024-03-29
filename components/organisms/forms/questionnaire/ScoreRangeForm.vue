<template lang="pug">
  el-collapse-item.score-range-form-wrapper(:name="scoreRange.key")
    template(slot="title"): .collapsible-item-title
      .texts
        .score-range-name {{ friendlyScoreRangeName }}
        .success(v-if="scoreRange.isValid") (Válido)
        .error(v-else) (Inválido)
      .slider-wrapper
        el-slider.slider(
          :value="[scoreRange.minScore, scoreRange.maxScore]"
          :disabled="minPossibleScoreIsSameAsMax"
          :min="minQuestionnaireScore"
          :max="maxQuestionnaireScore"
          :class="selectedColorClass"
          :show-tooltip="false"
          size="mini"
          range
          @click.native.stop
          @input="updateMinAndMaxScore"
        )
      .actions
        el-popconfirm(
          hide-icon
          title="Remover o intervalo?"
          cancelButtonText="Cancelar"
          confirmButtonText="Sim, remover"
          @onConfirm="emitDelete"
        )
          el-button(round type="text" size="mini" slot="reference" @mouseup.native.stop @click.stop) Remover

    el-form.px-2(v-bind="formProps" ref="form")
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
          @blur="updateScoreRangeField('title', trim(scoreRange.title))"
        )

      .mb-5: el-form-item(label="Descrição do intervalo" prop="description")
        .form-item-helper-text
          |Mostrado aos pacientes ao atingir a pontuação, pode conter instruções, avisos, encorajamento, etc.
        el-input(
          show-word-limit
          type="textarea"
          maxlength="2000"
          placeholder="Digite aqui"
          :autosize="{ minRows: 2 }"
          :value="scoreRange.description"
          @input="updateScoreRangeField('description', $event)"
          @blur="updateScoreRangeField('description', trim(scoreRange.description))"
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
import { Form } from 'element-ui';
import { debounce, trim } from 'lodash';
import { RecordPropsDefinition } from 'vue/types/options';
import { ElFormProps } from '~/types/element-ui';
import { UpdateFieldWithValueFunction } from '~/types/helpers';
import { QuestionnaireScoreRangeColor } from '~/types/gql';
import { KeyedScoreRangeInput, ScoreRangeInput } from './types';
import { getDefaultScoreRange } from './factoryFunctions';

type ColorOption = {
  value: QuestionnaireScoreRangeColor;
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
  trim: (value: string) => string;
  selectedColorClass: string;
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
    trim: () => trim,
    selectedColorClass() {
      const selectedColorOption = this.colorOptions.find(({ value }) => this.scoreRange.color === value);
      return selectedColorOption?.class || '';
    },
    colorOptions() {
      return [
        {
          label: 'Vermelho',
          class: 'red',
          value: QuestionnaireScoreRangeColor.Red,
        },
        {
          label: 'Laranja',
          class: 'orange',
          value: QuestionnaireScoreRangeColor.Orange,
        },
        {
          label: 'Amarelo',
          class: 'yellow',
          value: QuestionnaireScoreRangeColor.Yellow,
        },
        {
          label: 'Amarelo-verde',
          class: 'green-yellow',
          value: QuestionnaireScoreRangeColor.GreenYellow,
        },
        {
          label: 'Verde',
          class: 'green',
          value: QuestionnaireScoreRangeColor.Green,
        },
      ];
    },
    friendlyScoreRangeName() {
      const { title, minScore = 0, maxScore = 0 } = this.scoreRange;
      const isSingular = Math.abs(maxScore) <= 1;
      const isIntervalExact = minScore === maxScore;
      const formattedTitle = title || 'Intervalo sem nome';
      const formattedPoints = isSingular ? 'ponto' : 'pontos';

      if (isIntervalExact) return `${formattedTitle}, ${maxScore} ${formattedPoints}`;

      return `${formattedTitle}, de ${minScore} a ${maxScore} ${formattedPoints}`;
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
      @apply flex items-baseline pl-2 truncate;
      width: 35ch;

      .success,
      .error {
        @apply text-xs ml-1;
      }
      .success { @apply text-success }
      .error { @apply text-danger }
    }

    .actions {
      .el-button {
        @apply mr-4;
      }
    }
  }

  & >>> > div[role="tab"],
  & >>> > div[role="tabpanel"] {
    @apply relative;
  }

  .slider-wrapper {
    @apply px-6 flex-grow;

    .red {
      & >>> .el-slider__bar { @apply bg-red-500; }
      & >>> .el-slider__button { @apply border-red-500; }
    }
    .orange {
      & >>> .el-slider__bar { @apply bg-orange-500; }
      & >>> .el-slider__button { @apply border-orange-500; }
    }
    .yellow {
      & >>> .el-slider__bar { @apply bg-yellow-500; }
      & >>> .el-slider__button { @apply border-yellow-500; }
    }
    .green-yellow {
      & >>> .el-slider__bar { @apply bg-green-yellow; }
      & >>> .el-slider__button { @apply border-green-yellow; }
    }
    .green {
      & >>> .el-slider__bar { @apply bg-green-500; }
      & >>> .el-slider__button { @apply border-green-500; }
    }
  }

  .el-radio-button >>> span,
  .slider-wrapper >>> .el-slider__runway .el-slider__bar,
  .slider-wrapper >>> .el-slider__runway .el-slider__stop,
  .slider-wrapper >>> .el-slider__runway .el-slider__button-wrapper {
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
