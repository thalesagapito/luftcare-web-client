import gql from 'graphql-tag';

export default gql`
  mutation changeLoginCapability($id: ID!, $canLogin: Boolean!) {
    changeLoginCapability(id: $id, canLogin: $canLogin) {
      userFriendlyMessage
    }
  }
`;
