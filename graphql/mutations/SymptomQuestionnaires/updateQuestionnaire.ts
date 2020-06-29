import gql from 'graphql-tag';

export default gql`
  mutation updateQuestionnaire($idSharedBetweenVersions: ID!, $questionnaire: SymptomQuestionnaireInput!) {
    updateSymptomQuestionnaire(
      idSharedBetweenVersions: $idSharedBetweenVersions,
      questionnaire: $questionnaire
    ) {
      id
    }
  }
`;
