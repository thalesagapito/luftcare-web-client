import gql from 'graphql-tag';

export default gql`
  mutation publishQuestionnaire($id: ID!) {
    publishQuestionnaire(id: $id) {
      userFriendlyMessage
    }
  }
`;
