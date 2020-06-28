import gql from 'graphql-tag';

export default gql`
  mutation publishSymptomQuestionnaire($id: String!) {
    publishSymptomQuestionnaire(id: $id) {
      userFriendlyMessage
    }
  }
`;
