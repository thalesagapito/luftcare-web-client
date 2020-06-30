import { v4 as uuidv4 } from 'uuid';
import { SymptomQuestionnaireQuestionKind } from '~/types/gql';
import { KeyedQuestionInput, KeyedChoiceInput } from './types';

type DefaultQuestionGetter = (currentQuestionsLength?: number) => KeyedQuestionInput;
export const getDefaultQuestion: DefaultQuestionGetter = (currentQuestionsLength) => ({
  nameForManagement: `Pergunta ${(currentQuestionsLength || 0) + 1}`,
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
