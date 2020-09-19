import gql from 'graphql-tag';

export default gql`
  mutation unpublishQuestionnaire($id: ID!) {
    unpublishQuestionnaire(id: $id) {
      userFriendlyMessage
    }
  }
`;
