import gql from 'graphql-tag';

export default gql`
  query patients(
    $name: String
    $orderBy: [OrderByClause!]
    $pageNumber: Int
    $resultsPerPage: Int
  ) {

    users(
      name: $name
      role: PATIENT
      orderBy: $orderBy
      pageNumber: $pageNumber
      resultsPerPage: $resultsPerPage
    ) {

      hasMorePages
      totalResultsCount
      results {
        id
        createdAt
        email
        name
        phoneNumber
      }
    }
  }
`;
