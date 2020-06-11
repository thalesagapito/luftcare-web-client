import gql from 'graphql-tag';

export default gql`
  mutation createSymptomQuestionnaire($questionnaire: CreateSymptomQuestionnaireInput!) {
    createSymptomQuestionnaire(questionnaire: $questionnaire) {
      id
    }
  }
`;
