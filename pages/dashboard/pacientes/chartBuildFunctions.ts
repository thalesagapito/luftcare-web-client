/* eslint-disable import/prefer-default-export */
import { find, findIndex, uniq } from 'lodash';
import tailwindConfig from '~/tailwind.config';
import { SymptomQuestionnaireResponse } from '~/types/gql';

type Response = SymptomQuestionnaireResponse;
type ChartData = Chart.ChartData;
type Labels = string[];
type Dataset = NonNullable<ChartData['datasets']>[0];

function getFormattedResponseDate(responseDate: string): string {
  const dateObj = new Date(responseDate);
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric', month: 'numeric', year: 'numeric',
  };

  return dateObj.toLocaleDateString('pt-BR', formatOptions);
}

function getUpdatedDataset(responseDataset: Dataset, response: Response, labels: Labels): Dataset {
  const { responseDate, score } = response;

  const formattedDate = getFormattedResponseDate(responseDate);
  const responseDateIndex = findIndex(labels, (label) => label === formattedDate);

  const updatedData = responseDataset.data || [];
  updatedData[responseDateIndex] = score.value;

  return {
    ...responseDataset,
    data: updatedData as number[],
  };
}

function getUpdatedDatasets(currentDatasets: Dataset[], updatedDataset: Dataset): Dataset[] {
  return currentDatasets.map((existingDataset) => {
    const isCurrentDatasetBeingReplaced = existingDataset.label === updatedDataset.label;
    if (isCurrentDatasetBeingReplaced) return updatedDataset;

    return existingDataset;
  });
}

function getUpdatedLabels(responses: Response[]): string[] {
  const datesWithDuplicates = responses.map(({ responseDate }) => getFormattedResponseDate(responseDate));
  return uniq(datesWithDuplicates);
}

function getColor(colorSeed: number): string {
  const { colors } = tailwindConfig.theme;
  const colorSeedModulo = colorSeed % 5;
  switch (colorSeedModulo) {
    case 0: return colors.lapis;
    case 1: return colors.avocado;
    case 2: return colors.orange[500];
    case 3: return colors.pink[500];
    case 4:
    default: return colors.yellow[400];
  }
}

function getNewDataset(
  response: Response,
  questionnaireName: string,
  labels: Labels,
  colorSeed: number,
): Dataset {
  const color = getColor(colorSeed);
  const newDataset: Chart.ChartDataSets = {
    label: questionnaireName,
    borderColor: color,
    backgroundColor: `${color}20`,
  };
  return getUpdatedDataset(newDataset, response, labels);
}

export function transformResponsesToChartData(responses: Response[]): ChartData {
  const orderedResponses = responses.slice(0).reverse();
  const updatedLabels = getUpdatedLabels(orderedResponses);
  let colorSeed = 0;

  return orderedResponses.reduce(({ datasets = [] }, response) => {
    const { nameForManagement: questionnaireName } = response.questionnaire;

    const existingDataset = find(datasets, ({ label }) => label === questionnaireName);

    if (existingDataset === undefined) {
      const newDataset = getNewDataset(response, questionnaireName, updatedLabels, colorSeed);
      colorSeed += 1;
      return { labels: updatedLabels, datasets: [...datasets, newDataset] };
    }

    const updatedDataset = getUpdatedDataset(existingDataset, response, updatedLabels);
    const updatedDatasets = getUpdatedDatasets(datasets, updatedDataset);

    return {
      labels: updatedLabels,
      datasets: updatedDatasets,
    };
  }, { labels: [], datasets: [] } as ChartData);
}
