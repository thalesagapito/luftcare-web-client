import gql from 'graphql-tag';

export default gql`
  mutation deleteQuestionnaire($id: ID!) {
    deleteSymptomQuestionnaire(id: $id) {
      userFriendlyMessage
    }
  }
`;
