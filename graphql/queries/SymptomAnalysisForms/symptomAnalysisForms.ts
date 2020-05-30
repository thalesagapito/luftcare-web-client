import gql from 'graphql-tag';

export default gql`
query symptomAnalysisForms {
  symptomAnalysisForms {
    results {
      id
      name
      createdAt
      updatedAt

    }
  }
}
`;
