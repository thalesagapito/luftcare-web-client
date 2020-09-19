import { omit } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  ChoiceInput,
  QuestionInput,
  ScoreRangeInput,
  KeyedChoiceInput,
  KeyedQuestionInput,
  QuestionnaireInput,
  KeyedScoreRangeInput,
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


/** ******** */
/* ScoreRanges */
type ScoreRangeInputUnkeyer = (scoreRange: KeyedScoreRangeInput) => ScoreRangeInput;
const unkeyScoreRange: ScoreRangeInputUnkeyer = (scoreRange) => omit(scoreRange, ['key', 'isValid']);
type ScoreRangeInputKeyer = (scoreRange: ScoreRangeInput) => KeyedScoreRangeInput;
const keyScoreRange: ScoreRangeInputKeyer = (keylessScoreRange) => ({
  ...keylessScoreRange,
  key: uuidv4(),
  isValid: true,
});
/* ScoreRanges */
/** ******** */


/** ************ */
/* Questionnaire */
type QuestionnaireInputUnkeyer = (questionnaire: KeyedQuestionnaireInput) => QuestionnaireInput;
export const unkeyQuestionnaire: QuestionnaireInputUnkeyer = (questionnaire) => ({
  ...questionnaire,
  questions: (questionnaire.questions || []).map(unkeyQuestion),
  scoreRanges: (questionnaire.scoreRanges || []).map(unkeyScoreRange),
});
type QuestionnaireInputKeyer = (questionnaire: QuestionnaireInput) => KeyedQuestionnaireInput;
export const keyQuestionnaire: QuestionnaireInputKeyer = (keylessQuestionnaire) => ({
  ...keylessQuestionnaire,
  questions: (keylessQuestionnaire.questions || []).map(keyQuestion),
  scoreRanges: (keylessQuestionnaire.scoreRanges || []).map(keyScoreRange),
});
/* Questionnaire */
/** ************ */
