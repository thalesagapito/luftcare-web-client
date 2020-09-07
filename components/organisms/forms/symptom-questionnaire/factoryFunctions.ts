import { v4 as uuidv4 } from 'uuid';
import { KeyedQuestionInput, KeyedChoiceInput, KeyedScoreRangeInput } from './types';
import { SymptomQuestionnaireQuestionKind, SymptomQuestionnaireScoreRangeColor } from '~/types/gql';

type DefaultQuestionGetter = (currentQuestionsLength?: number) => KeyedQuestionInput;
export const getDefaultQuestion: DefaultQuestionGetter = (currentQuestionsLength) => ({
  nameForManagement: '',
  presentationOrder: (currentQuestionsLength || 0) + 1,
  text: '',
  kind: SymptomQuestionnaireQuestionKind.MultipleChoice,
  possibleChoices: [],
  key: uuidv4(),
  isValid: false,
});

type DefaultChoiceGetter = (currentChoicesLength?: number) => KeyedChoiceInput;
export const getDefaultChoice: DefaultChoiceGetter = (currentChoicesLength) => ({
  nameForManagement: `Alternativa ${(currentChoicesLength || 0) + 1}`,
  presentationOrder: (currentChoicesLength || 0) + 1,
  text: '',
  value: 1,
  key: uuidv4(),
  isValid: false,
});

// TODO figure out the best args for making this work more intuitively
type DefaultScoreRangeGetter = () => KeyedScoreRangeInput;
export const getDefaultScoreRange: DefaultScoreRangeGetter = () => ({
  title: 'Intervalo',
  description: 'Descrição do intervalo',
  color: SymptomQuestionnaireScoreRangeColor.Yellow,
  maxScore: 0,
  minScore: 0,
  key: uuidv4(),
  isValid: false,
});
