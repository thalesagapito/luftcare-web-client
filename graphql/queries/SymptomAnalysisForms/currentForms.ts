import gql from 'graphql-tag';

export default gql`
query currentSymptomAnalysisForms(
  $name: String
  $orderBy: [OrderByClause!]
  $pageNumber: Int
  $isPublished: Boolean
  $resultsPerPage: Int
  ) {
  symptomAnalysisForms(
    currentVersionsOnly: true
    name: $name
    orderBy: $orderBy
    pageNumber: $pageNumber
    isPublished: $isPublished
    resultsPerPage: $resultsPerPage
    ) {
    results {
      id
      name
      createdAt
      updatedAt
      version
      questions {
        name
      }
    }
    hasMorePages
    totalResultsCount
  }
}
`;
