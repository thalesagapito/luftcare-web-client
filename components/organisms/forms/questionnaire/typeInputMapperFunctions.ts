import {
  ChoiceType,
  ChoiceInput,
  QuestionType,
  QuestionInput,
  ScoreRangeType,
  ScoreRangeInput,
  QuestionnaireType,
  QuestionnaireInput,
} from './types';


/** ****** */
/* Choices */
type ChoiceTypeToInputMapper = (choice: ChoiceType) => ChoiceInput;
export const mapChoiceTypeToInput: ChoiceTypeToInputMapper = (choice) => ({
  nameForManagement: choice.nameForManagement,
  presentationOrder: choice.presentationOrder,
  value: choice.value,
  text: choice.text,
});
/* Choices */
/** ****** */


/** ******** */
/* Questions */
type QuestionTypeToInputMapper = (question: QuestionType) => QuestionInput;
export const mapQuestionTypeToInput: QuestionTypeToInputMapper = (question) => ({
  kind: question.kind,
  text: question.text,
  nameForManagement: question.nameForManagement,
  presentationOrder: question.presentationOrder,
  possibleChoices: question.possibleChoices
    ? question.possibleChoices.map(mapChoiceTypeToInput)
    : undefined,
});
/* Questions */
/** ******** */


/** ******** */
/* ScoreRanges */
type ScoreRangeTypeToInputMapper = (scoreRange: ScoreRangeType) => ScoreRangeInput;
export const mapScoreRangeTypeToInput: ScoreRangeTypeToInputMapper = (scoreRange) => ({
  color: scoreRange.color,
  description: scoreRange.description,
  maxScore: scoreRange.maxScore,
  minScore: scoreRange.minScore,
  title: scoreRange.title,
});
/* ScoreRanges */
/** ******** */


/** ************ */
/* Questionnaire */
type QuestionnaireTypeToInputMapper = (questionnaire: QuestionnaireType) => QuestionnaireInput;
export const mapQuestionnaireTypeToInput: QuestionnaireTypeToInputMapper = (questionnaire) => ({
  nameForManagement: questionnaire.nameForManagement,
  nameForPresentation: questionnaire.nameForPresentation,
  questions: (questionnaire.questions || []).map(mapQuestionTypeToInput),
  scoreRanges: (questionnaire.scoreRanges || []).map(mapScoreRangeTypeToInput),
  isPublished: questionnaire.isPublished,
});
/* Questionnaire */
/** ************ */
