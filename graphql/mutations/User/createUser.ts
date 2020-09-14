import gql from 'graphql-tag';

export default gql`
  mutation createUser($userData: CreateUserInput!) {
    createUser(userData: $userData) {
      id
    }
  }
`;
