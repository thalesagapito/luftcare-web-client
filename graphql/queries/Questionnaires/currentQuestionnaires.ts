import gql from 'graphql-tag';

export default gql`
  query currentQuestionnaires(
    $name: String
    $orderBy: [OrderByClause!]
    $pageNumber: Int
    $isPublished: Boolean
    $resultsPerPage: Int
    ) {

    questionnaires(
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
