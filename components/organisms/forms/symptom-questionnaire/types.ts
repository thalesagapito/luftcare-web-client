import {
  Keyed,
  Override,
  WithIsValid,
} from '~/types/helpers';
import {
  SymptomQuestionnaire,
  SymptomQuestionnaireInput,
  SymptomQuestionnaireQuestion,
  SymptomQuestionnaireScoreRange,
  SymptomQuestionnaireQuestionInput,
  SymptomQuestionnaireQuestionChoice,
  SymptomQuestionnaireScoreRangeInput,
  SymptomQuestionnaireQuestionChoiceInput,
} from '~/types/gql';

/** ****** */
/* Choices */
export type ChoiceType = SymptomQuestionnaireQuestionChoice;
export type ChoiceInput = SymptomQuestionnaireQuestionChoiceInput;
export type KeyedChoiceInput = Keyed<WithIsValid<ChoiceInput>>;
/* Choices */
/** ****** */


/** ******** */
/* Questions */
export type QuestionType = SymptomQuestionnaireQuestion;
export type QuestionInput = SymptomQuestionnaireQuestionInput;
type QuestionWithKeyedChoices = Override<QuestionInput, { possibleChoices?: KeyedChoiceInput[] }>;
export type KeyedQuestionInput = Keyed<WithIsValid<QuestionWithKeyedChoices>>;
/* Questions */
/** ******** */


/** ******** */
/* ScoreRanges */
export type ScoreRangeType = SymptomQuestionnaireScoreRange;
export type ScoreRangeInput = SymptomQuestionnaireScoreRangeInput;
export type KeyedScoreRangeInput = Keyed<WithIsValid<ScoreRangeInput>>;
/* ScoreRanges */
/** ******** */


/** ************ */
/* Questionnaire */
export type QuestionnaireType = SymptomQuestionnaire;
export type QuestionnaireInput = SymptomQuestionnaireInput;
export type KeyedQuestionnaireInput = Override<QuestionnaireInput, {
  questions: KeyedQuestionInput[],
  scoreRanges: KeyedScoreRangeInput[],
}>;
/* Questionnaire */
/** ************ */
