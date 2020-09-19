import gql from 'graphql-tag';

export default gql`
  mutation changePublishStatus($id: ID!, $isPublished: Boolean!) {
    changeQuestionnairePublishStatus(isPublished: $isPublished, id: $id) {
      userFriendlyMessage
    }
  }
`;
