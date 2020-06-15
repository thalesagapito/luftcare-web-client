import gql from 'graphql-tag';

export default gql`
  mutation createSymptomQuestionnaire($questionnaire: SymptomQuestionnaireInput!) {
    createSymptomQuestionnaire(questionnaire: $questionnaire) {
      id
    }
  }
`;
