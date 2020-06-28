import gql from 'graphql-tag';

export default gql`
query currentSymptomQuestionnaires(
  $name: String
  $orderBy: [OrderByClause!]
  $pageNumber: Int
  $isPublished: Boolean
  $resultsPerPage: Int
  ) {
  symptomQuestionnaires(
    currentVersionsOnly: true
    nameForManagement: $name
    orderBy: $orderBy
    pageNumber: $pageNumber
    isPublished: $isPublished
    resultsPerPage: $resultsPerPage
    ) {
    results {
      id
      idSharedBetweenVersions
      nameForManagement
      nameForPresentation
      createdAt
      updatedAt
      version
      isPublished
      questions {
        nameForManagement
      }
    }
    hasMorePages
    totalResultsCount
  }
}
`;
