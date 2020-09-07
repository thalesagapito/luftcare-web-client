import {
  min,
  max,
  map,
  reduce,
} from 'lodash';
import { KeyedQuestionnaireInput } from './types';

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
