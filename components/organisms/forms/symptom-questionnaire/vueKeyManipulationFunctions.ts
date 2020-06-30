import { omit } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  ChoiceInput,
  QuestionInput,
  KeyedChoiceInput,
  KeyedQuestionInput,
  QuestionnaireInput,
  KeyedQuestionnaireInput,
} from './types';

/** ****** */
/* Choices */
type ChoiceInputUnkeyer = (choice: KeyedChoiceInput) => ChoiceInput;
const unkeyChoice: ChoiceInputUnkeyer = (choice) => omit(choice, ['key', 'isValid']);
type ChoiceInputKeyer = (choice: ChoiceInput) => KeyedChoiceInput;
const keyChoice: ChoiceInputKeyer = (choice) => ({ ...choice, key: uuidv4(), isValid: true });
/* Choices */
/** ****** */


/** ******** */
/* Questions */
type QuestionInputUnkeyer = (question: KeyedQuestionInput) => QuestionInput;
const unkeyQuestion: QuestionInputUnkeyer = (question) => ({
  ...omit(question, ['key', 'isValid']),
  possibleChoices: (question.possibleChoices || []).map(unkeyChoice),
});
type QuestionInputKeyer = (question: QuestionInput) => KeyedQuestionInput;
const keyQuestion: QuestionInputKeyer = (keylessQuestion) => ({
  ...keylessQuestion,
  key: uuidv4(),
  isValid: true,
  possibleChoices: (keylessQuestion.possibleChoices || []).map(keyChoice),
});
/* Questions */
/** ******** */


/** ************ */
/* Questionnaire */
type QuestionnaireInputUnkeyer = (questionnaire: KeyedQuestionnaireInput) => QuestionnaireInput;
export const unkeyQuestionnaire: QuestionnaireInputUnkeyer = (questionnaire) => ({
  ...questionnaire,
  questions: (questionnaire.questions || []).map(unkeyQuestion),
});
type QuestionnaireInputKeyer = (questionnaire: QuestionnaireInput) => KeyedQuestionnaireInput;
export const keyQuestionnaire: QuestionnaireInputKeyer = (keylessQuestionnaire) => ({
  ...keylessQuestionnaire,
  questions: (keylessQuestionnaire.questions || []).map(keyQuestion),
});
/* Questionnaire */
/** ************ */
