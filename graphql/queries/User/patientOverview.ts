import gql from 'graphql-tag';

export default gql`
query patientOverview($id: ID!) {
  user(id: $id) {
    name
    email
    phoneNumber
    createdAt
  }
  questionnaireResponses(
    userId: $id,
    pageNumber: 1,
    resultsPerPage: 100,
    orderBy: [{columnName: "responseDate", direction: DESC}],
  ) {
    totalResultsCount
    hasMorePages
    results {
      responseDate
      score {
        value
        color
        title
      }
      questionnaire {
        nameForPresentation
        nameForManagement
      }
    }
  }
}
`;
