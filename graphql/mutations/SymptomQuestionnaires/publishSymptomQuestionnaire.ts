import gql from 'graphql-tag';

export default gql`
  mutation publishSymptomQuestionnaire($id: ID!) {
    publishSymptomQuestionnaire(id: $id) {
      userFriendlyMessage
    }
  }
`;
