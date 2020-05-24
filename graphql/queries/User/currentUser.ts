import gql from 'graphql-tag';

export default gql`
  query currentUserFullInfo {
    currentUser {
      name
      email
      phoneNumber
      role
    }
  }
`;
