import gql from 'graphql-tag';

export default gql`
  mutation unpublishSymptomQuestionnaire($id: String!) {
    unpublishSymptomQuestionnaire(id: $id) {
      userFriendlyMessage
    }
  }
`;
