import gql from 'graphql-tag';

export default gql`
  query getQuestionnaire($id: ID!) {
    symptomQuestionnaire(id: $id) {
      id
      idSharedBetweenVersions
      isPublished
      nameForManagement
      nameForPresentation
      questions {
        id
        kind
        nameForManagement
        presentationOrder
        text
        possibleChoices {
          id
          nameForManagement
          text
          presentationOrder
          value
        }
      }
    }
  }
`;
