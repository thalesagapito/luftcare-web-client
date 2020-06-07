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
    nameForManagement: $name
    orderBy: $orderBy
    pageNumber: $pageNumber
    isPublished: $isPublished
    resultsPerPage: $resultsPerPage
    ) {
    results {
      id
      nameForManagement
      nameForPresentation
      createdAt
      updatedAt
      version
      questions {
        nameForManagement
      }
    }
    hasMorePages
    totalResultsCount
  }
}
`;
