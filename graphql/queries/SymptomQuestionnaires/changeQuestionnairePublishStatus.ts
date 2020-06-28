import gql from 'graphql-tag';

export default gql`
  mutation changePublishStatus($id: String!, $isPublished: Boolean!) {
    changeSymptomQuestionnairePublishStatus(isPublished: $isPublished, id: $id) {
      userFriendlyMessage
    }
  }
`;
