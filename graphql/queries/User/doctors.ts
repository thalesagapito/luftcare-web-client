import gql from 'graphql-tag';

export default gql`
  query doctors(
    $name: String
    $orderBy: [OrderByClause!]
    $pageNumber: Int
    $resultsPerPage: Int
  ) {

    users(
      name: $name
      role: DOCTOR
      orderBy: $orderBy
      pageNumber: $pageNumber
      resultsPerPage: $resultsPerPage
    ) {

      hasMorePages
      totalResultsCount
      results {
        id
        createdAt
        canLogin
        email
        name
        phoneNumber
      }
    }
  }
`;
