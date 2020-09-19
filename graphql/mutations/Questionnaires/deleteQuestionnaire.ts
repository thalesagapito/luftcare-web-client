import gql from 'graphql-tag';

export default gql`
  mutation deleteQuestionnaire($id: ID!) {
    deleteQuestionnaire(id: $id) {
      userFriendlyMessage
    }
  }
`;
