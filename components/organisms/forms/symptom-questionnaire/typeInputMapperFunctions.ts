import {
  ChoiceType,
  ChoiceInput,
  QuestionType,
  QuestionInput,
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


/** ************ */
/* Questionnaire */
type QuestionnaireTypeToInputMapper = (questionnaire: QuestionnaireType) => QuestionnaireInput;
export const mapQuestionnaireTypeToInput: QuestionnaireTypeToInputMapper = (questionnaire) => ({
  nameForManagement: questionnaire.nameForManagement,
  nameForPresentation: questionnaire.nameForPresentation,
  questions: (questionnaire.questions || []).map(mapQuestionTypeToInput),
  // TODO
  scoreRanges: (questionnaire.scoreRanges || []).map((a) => a),
  isPublished: questionnaire.isPublished,
});
/* Questionnaire */
/** ************ */
