import gql from 'graphql-tag';

export default gql`
query currentSymptomAnalysisForms($isPublished: Boolean) {
  symptomAnalysisForms(currentVersionsOnly: true, isPublished: $isPublished) {
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
