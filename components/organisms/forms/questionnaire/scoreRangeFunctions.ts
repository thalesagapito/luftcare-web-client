import {
  min,
  max,
  map,
  last,
  reduce,
  filter,
  initial,
  forEach,
} from 'lodash';
import { KeyedQuestionnaireInput, KeyedScoreRangeInput } from './types';
import { Nullable } from '~/types/helpers';

export type MinMaxScorePair = { minScore: number, maxScore: number };

function getMinAndMaxChoiceValues(question: KeyedQuestionnaireInput['questions'][0]): MinMaxScorePair {
  const { possibleChoices = [] } = question;
  const choiceValues = map(possibleChoices, 'value');

  return {
    minScore: min(choiceValues) || 0,
    maxScore: max(choiceValues) || 0,
  };
}

export function getMinAndMaxQuestionnaireScore(questionnaire: KeyedQuestionnaireInput): MinMaxScorePair {
  const { questions = [] } = questionnaire;
  return reduce(questions, (acc, question) => {
    const { minScore, maxScore } = getMinAndMaxChoiceValues(question);
    return {
      minScore: acc.minScore + minScore,
      maxScore: acc.maxScore + maxScore,
    };
  }, { minScore: 0, maxScore: 0 });
}

function rangesOverlap(firstRange: KeyedScoreRangeInput, secondRange: KeyedScoreRangeInput): boolean {
  const { minScore: firstStart, maxScore: firstEnd } = firstRange;
  const { minScore: secondStart, maxScore: secondEnd } = secondRange;

  const firstRangeEndsBeforeSecondRangeStarts = firstEnd < secondStart;
  const secondRangeEndsBeforeFirstRangeStarts = secondEnd < firstStart;

  return !firstRangeEndsBeforeSecondRangeStarts && !secondRangeEndsBeforeFirstRangeStarts;
}

function getOverlappingRanges(scoreRanges: KeyedScoreRangeInput[]): KeyedScoreRangeInput[] {
  let overlappingRanges: KeyedScoreRangeInput[] = [];

  scoreRanges.reduce((previousRanges, currentRange) => {
    const overlappedRange = previousRanges.find((previous) => rangesOverlap(previous, currentRange));
    if (overlappedRange) overlappingRanges = [overlappedRange, currentRange];

    return [...previousRanges, currentRange];
  }, [] as KeyedScoreRangeInput[]);

  return overlappingRanges;
}

function getNotCoveredScores(questionnaire: MinMaxScorePair, ranges: KeyedScoreRangeInput[]): number[] {
  const possibleScoresLength = questionnaire.maxScore - questionnaire.minScore + 1;
  const emptyPossibleScores = Array(possibleScoresLength).fill(undefined);

  let possibleScores = map(emptyPossibleScores, (_, i) => ({
    scoreValue: i + questionnaire.minScore,
    covered: false,
  }));

  forEach(ranges, (range) => {
    possibleScores = map(possibleScores, ({ scoreValue, covered }) => {
      if (covered) return { scoreValue, covered };
      return { scoreValue, covered: scoreValue >= range.minScore && scoreValue <= range.maxScore };
    });
  });

  const notCoveredScores = filter(possibleScores, ['covered', false]);
  const notCoveredScoresValues = map(notCoveredScores, 'scoreValue');

  return notCoveredScoresValues;
}

function getOverlapErrorMessage(overlappingRanges: KeyedScoreRangeInput[] = []): Nullable<string> {
  if (overlappingRanges.length === 0) return undefined;

  const [firstRange, secondRange] = overlappingRanges;
  const { title: firstRangeTitle } = firstRange;
  const { title: secondRangeTitle } = secondRange;

  if (firstRangeTitle && secondRangeTitle) {
    return `\
    Os intervalos "${firstRangeTitle}" e "${secondRangeTitle}" estão se sobrepondo em alguma pontuação`;
  }

  return 'Dois ou mais intervalos estão se sobrepondo em alguma pontuação';
}

function getNotCoveredScoresErrorMessage(notCoveredScores: number[] = []): Nullable<string> {
  if (notCoveredScores.length === 0) return undefined;

  const isSingular = notCoveredScores.length === 1;
  const firstScore = notCoveredScores[0];
  if (isSingular) return `A pontuação ${firstScore} não está incluída em nenhum intervalo`;

  const lastScore = last(notCoveredScores);
  const firstScores = initial(notCoveredScores);
  const formattedFirstScores = firstScores.join(', ');
  return `As pontuações ${formattedFirstScores} e ${lastScore} não estão incluídas em nenhum intervalo`;
}

type ValidationState = {
  isValid: boolean;
  errorMessage?: string;
};
export function validateScoreRanges(questionnaire: KeyedQuestionnaireInput): ValidationState {
  const minAndMaxPossibleScores = getMinAndMaxQuestionnaireScore(questionnaire);
  const { scoreRanges } = questionnaire;

  const overlappingRanges = getOverlappingRanges(scoreRanges);
  const notCoveredScores = getNotCoveredScores(minAndMaxPossibleScores, scoreRanges);

  const allScoresAreCovered = notCoveredScores.length === 0;
  const noRangesOverlap = overlappingRanges.length === 0;
  const errorMessage = getOverlapErrorMessage(overlappingRanges)
  || getNotCoveredScoresErrorMessage(notCoveredScores);


  return {
    isValid: noRangesOverlap && allScoresAreCovered,
    errorMessage,
  };
}
