import gql from 'graphql-tag';

export default gql`
  mutation updateQuestionnaire($id: ID!, $questionnaire: SymptomQuestionnaireInput!) {
    updateSymptomQuestionnaire(
      id: $id,
      questionnaire: $questionnaire
    ) {
      id
    }
  }
`;
