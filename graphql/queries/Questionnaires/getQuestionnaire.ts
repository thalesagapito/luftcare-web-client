import gql from 'graphql-tag';

export default gql`
  query getQuestionnaire($id: ID!) {
    questionnaire(id: $id) {
      id
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
      scoreRanges {
        id
        color
        title
        minScore
        maxScore
        description
      }
    }
  }
`;
