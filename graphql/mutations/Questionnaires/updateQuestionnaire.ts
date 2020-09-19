import gql from 'graphql-tag';

export default gql`
  mutation updateQuestionnaire($id: ID!, $questionnaire: QuestionnaireInput!) {
    updateQuestionnaire(
      id: $id,
      questionnaire: $questionnaire
    ) {
      id
    }
  }
`;
