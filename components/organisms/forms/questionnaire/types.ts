import {
  Keyed,
  Override,
  WithIsValid,
} from '~/types/helpers';
import {
  Questionnaire,
  QuestionnaireInput as GeneratedQuestionnaireInput,
  QuestionnaireQuestion,
  QuestionnaireScoreRange,
  QuestionnaireQuestionInput,
  QuestionnaireQuestionChoice,
  QuestionnaireScoreRangeInput,
  QuestionnaireQuestionChoiceInput,
} from '~/types/gql';

/** ****** */
/* Choices */
export type ChoiceType = QuestionnaireQuestionChoice;
export type ChoiceInput = QuestionnaireQuestionChoiceInput;
export type KeyedChoiceInput = Keyed<WithIsValid<ChoiceInput>>;
/* Choices */
/** ****** */


/** ******** */
/* Questions */
export type QuestionType = QuestionnaireQuestion;
export type QuestionInput = QuestionnaireQuestionInput;
type QuestionWithKeyedChoices = Override<QuestionInput, { possibleChoices?: KeyedChoiceInput[] }>;
export type KeyedQuestionInput = Keyed<WithIsValid<QuestionWithKeyedChoices>>;
/* Questions */
/** ******** */


/** ******** */
/* ScoreRanges */
export type ScoreRangeType = QuestionnaireScoreRange;
export type ScoreRangeInput = QuestionnaireScoreRangeInput;
export type KeyedScoreRangeInput = Keyed<WithIsValid<ScoreRangeInput>>;
/* ScoreRanges */
/** ******** */


/** ************ */
/* Questionnaire */
export type QuestionnaireType = Questionnaire;
export type QuestionnaireInput = GeneratedQuestionnaireInput;
export type KeyedQuestionnaireInput = Override<QuestionnaireInput, {
  questions: KeyedQuestionInput[],
  scoreRanges: KeyedScoreRangeInput[],
}>;
/* Questionnaire */
/** ************ */
