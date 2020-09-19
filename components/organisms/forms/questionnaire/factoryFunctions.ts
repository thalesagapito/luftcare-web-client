import { v4 as uuidv4 } from 'uuid';
import { max, map, min } from 'lodash';
import { MinMaxScorePair } from './scoreRangeFunctions';
import { KeyedQuestionInput, KeyedChoiceInput, KeyedScoreRangeInput } from './types';
import { QuestionnaireQuestionKind, QuestionnaireScoreRangeColor } from '~/types/gql';

type DefaultQuestionGetter = (currentQuestionsLength?: number) => KeyedQuestionInput;
export const getDefaultQuestion: DefaultQuestionGetter = (currentQuestionsLength) => ({
  nameForManagement: '',
  presentationOrder: (currentQuestionsLength || 0) + 1,
  text: '',
  kind: QuestionnaireQuestionKind.MultipleChoice,
  possibleChoices: [],
  key: uuidv4(),
  isValid: false,
});

type DefaultChoiceGetter = (currentChoicesLength?: number) => KeyedChoiceInput;
export const getDefaultChoice: DefaultChoiceGetter = (currentChoicesLength) => ({
  nameForManagement: `Alternativa ${(currentChoicesLength || 0) + 1}`,
  presentationOrder: (currentChoicesLength || 0) + 1,
  text: '',
  value: 0,
  key: uuidv4(),
  isValid: false,
});

type DefaultScoreRangeGetter = (
  currentScoreRanges: KeyedScoreRangeInput[],
  minAndMaxPossibleScores: MinMaxScorePair,
) => KeyedScoreRangeInput;
export const getDefaultScoreRange: DefaultScoreRangeGetter = (
  currentScoreRanges,
  { minScore: minPossibleScore, maxScore: maxPossibleScore },
) => {
  const currentMinScores = map(currentScoreRanges, 'minScore');
  const currentLowestMinScore = min(currentMinScores || [minPossibleScore])!;
  const currentMaxScores = map(currentScoreRanges, 'maxScore');
  const currentHighestMaxScore = max(currentMaxScores || [maxPossibleScore])!;

  let newRange: MinMaxScorePair = { minScore: minPossibleScore, maxScore: maxPossibleScore };

  const hasSpaceForHigherScoreRange = currentHighestMaxScore < maxPossibleScore;
  if (hasSpaceForHigherScoreRange) {
    newRange = {
      minScore: currentHighestMaxScore + 1,
      maxScore: maxPossibleScore,
    };
  }

  const hasSpaceForLowerScoreRange = currentLowestMinScore > minPossibleScore;
  if (hasSpaceForLowerScoreRange) {
    newRange = {
      minScore: minPossibleScore,
      maxScore: currentLowestMinScore - 1,
    };
  }

  return {
    title: '',
    description: '',
    color: QuestionnaireScoreRangeColor.Yellow,
    minScore: newRange.minScore,
    maxScore: newRange.maxScore,
    key: uuidv4(),
    isValid: false,
  };
};
