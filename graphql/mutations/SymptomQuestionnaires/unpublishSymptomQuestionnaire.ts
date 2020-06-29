import gql from 'graphql-tag';

export default gql`
  mutation unpublishSymptomQuestionnaire($id: ID!) {
    unpublishSymptomQuestionnaire(id: $id) {
      userFriendlyMessage
    }
  }
`;
