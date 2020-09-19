import gql from 'graphql-tag';

export default gql`
  mutation createQuestionnaire($questionnaire: QuestionnaireInput!) {
    createQuestionnaire(questionnaire: $questionnaire) {
      id
    }
  }
`;
