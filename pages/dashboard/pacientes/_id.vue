<template lang="pug">
  .dashboard-page-wrapper
    the-header(v-bind="headerProps")

    .info-header
      shadowed-card.user-info
        .title {{ patientName }}
        .mt-1 {{ patientEmail }}
        .mb-1 {{ patientPhoneNumber }}
      shadowed-card.responses-info
        .info
          .number.text-lapis {{ responseCount }}
          .name Respostas
        .info
          .number.text-success {{ positiveResponseCount }}
          .name Pontuações positivas
        .info
          .number.text-danger {{ negativeResponseCount }}
          .name Pontuações negativas

    shadowed-card.scores-chart
      .title Gráfico de pontuações
      line-chart(:data="chartData")

    shadowed-card.history
      .title Histórico de respostas
      el-table.no-header(:data="responses")
        el-table-column
          template(slot-scope="{ row }")
            span.pr-1 Respondeu o questionário
            strong {{ row.questionnaire.nameForManagement }}

        el-table-column(align="right")
          template(slot-scope="{ row }")
            span {{ formatResponseDate(row.responseDate) }}

        el-table-column(align="center" min-width="25px")
          template(slot-scope="{ row }")
            score-colored-chip.mx-auto(:score="row.score" is-value-visible)
</template>

<script lang="ts">
import Vue from 'vue';
import isUUID from 'validator/lib/isUUID';
import { capitalize, debounce } from 'lodash';

import {
  User,
  Query,
  QuestionnaireResponse,
  QuestionnaireScoreRangeColor,
} from '~/types/gql';
import { RegisteredLayout, RegisteredMiddleware } from '~/enums';
import PatientOverviewQueryGQL from '~/graphql/queries/User/patientOverview';
import smartQueryErrorHandler from '~/errorHandling/apollo/smartQueryErrorHandler';

import ShadowedCard from '~/components/atoms/ShadowedCard.vue';
import ScoreColoredChip from '~/components/atoms/score/ScoreColoredChip.vue';
import LineChart, { Props as LineChartProps } from '~/components/atoms/charts/LineChart.vue';
import TheHeader, { Props as HeaderProps } from '~/components/molecules/HeaderWithBreadcrumbs.vue';
import { transformResponsesToChartData } from './chartBuildFunctions';

export const PATIENT_PATH = '/dashboard/pacientes/:id';

type Data = {
  overview: {
    user?: User;
    responses?: QuestionnaireResponse[];
  };
};
type Methods = {
  formatResponseDate: (gqlDate: string) => string;
};
type Computed = {
  patientName: string;
  patientEmail: string;
  patientPhoneNumber: string;
  headerProps: HeaderProps;
  responseCount: number;
  positiveResponseCount: number;
  negativeResponseCount: number;
  chartData: LineChartProps['data'];
  responses: NonNullable<Data['overview']['responses']>;
};
export type Props = {};
export type Events = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: RegisteredLayout.dashboard,
  middleware: RegisteredMiddleware.isUserAuthenticated,
  components: {
    TheHeader,
    LineChart,
    ShadowedCard,
    ScoreColoredChip,
  },
  data() {
    return {
      overview: { user: undefined, responses: [] },
    };
  },
  apollo: {
    overview: {
      query: PatientOverviewQueryGQL,
      error: debounce(smartQueryErrorHandler, 10),
      variables() { return { id: this.$route.params.id }; },
      update({ user, questionnaireResponses }: Partial<Query>): Data['overview'] {
        return {
          user: user || undefined,
          responses: questionnaireResponses?.results || [],
        };
      },
    },
  },
  computed: {
    patientName() {
      return this.overview?.user?.name || '';
    },
    patientEmail() {
      return this.overview?.user?.email || '';
    },
    patientPhoneNumber() {
      return this.overview?.user?.phoneNumber || '';
    },
    responses() {
      return this.overview?.responses || [];
    },
    responseCount() {
      return this.responses.length;
    },
    positiveResponseCount() {
      const positiveColors = [
        QuestionnaireScoreRangeColor.Green,
        QuestionnaireScoreRangeColor.GreenYellow,
      ];
      return this.responses.filter(({ score }) => positiveColors.includes(score.color)).length;
    },
    negativeResponseCount() {
      const negativeColors = [
        QuestionnaireScoreRangeColor.Red,
        QuestionnaireScoreRangeColor.Orange,
      ];
      return this.responses.filter(({ score }) => negativeColors.includes(score.color)).length;
    },
    chartData() {
      return transformResponsesToChartData(this.overview?.responses || []);
    },
    headerProps() {
      return {
        breadcrumbs: {
          items: [
            { label: 'Início', to: '/dashboard' },
            { label: 'Pacientes', to: '/dashboard/pacientes' },
            { label: this.patientName, to: '' },
          ],
        },
      };
    },
  },
  methods: {
    formatResponseDate(gqlDate) {
      const dateObj = new Date(gqlDate);
      const formatOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      };

      return capitalize(dateObj.toLocaleDateString('pt-BR', formatOptions));
    },

  },
  head() {
    const { patientName } = this;
    return {
      titleTemplate(base) {
        return `${base} - Acompanhar paciente ${patientName}`;
      },
    };
  },
  validate({ params }) {
    const { id } = params;
    if (!id) throw new Error('Identificador de paciente ausente na url');
    if (!isUUID(id)) throw new Error('Identificador de paciente inválido');
    return true;
  },
});
</script>

<style lang="postcss" scoped>
.dashboard-page-wrapper {
  @apply flex flex-col;

  .history,
  .scores-chart,
  .info-header .user-info,
  .info-header .responses-info {
    @apply p-4;

    .title {
      @apply text-lg font-bold;
    }
  }

  .info-header {
    @apply flex flex-row pb-6 mt-6 h-36;

    .user-info,
    .responses-info {
      @apply h-full;
    }

    .user-info {
      @apply text-white w-2/5 mr-6 flex flex-col justify-center items-start pl-8
      bg-gradient-to-tr from-lapis to-transparent bg-indigo-500
      transition-colors duration-200 ease-out;

      &:hover {
        @apply bg-opacity-90;
      }

      .title {
        @apply uppercase;
      }
    }

    .responses-info {
      @apply bg-white w-3/5 flex flex-row justify-around items-center;

      .info {
        @apply flex flex-col justify-center items-center mx-2;

        .number {
          @apply text-4xl font-bold;
        }
        .name {
          @apply text-sm text-gray-500 text-center font-semibold truncate;
        }
      }
    }
  }

  .scores-chart {
    @apply pt-6 pl-8 mb-6;
  }

  .history {
    .title {
      @apply pl-2 pt-2 pb-3;
    }
    .no-header {
      &::before,
      & >>> .el-table__header-wrapper {
        @apply hidden;
      }

      & >>> tr {
        td:first-of-type {
          @apply rounded-l-md;
        }
        td:last-of-type {
          @apply rounded-r-md;
        }
      }
    }
  }
}
</style>
