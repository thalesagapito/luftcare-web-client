import gql from 'graphql-tag';

export default gql`
  mutation createSymptomAnalysisForm($form: CreateSymptomAnalysisFormInput!) {
    createSymptomAnalysisForm(form: $form) {
      id
    }
  }
`;
