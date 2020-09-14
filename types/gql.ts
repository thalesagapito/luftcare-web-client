export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

/** Required data to manually create an application user through the admin panel */
export type CreateUserInput = {
  /** maxLength: 500 */
  name: Scalars['String'];
  /** maxLength: 500 */
  email: Scalars['String'];
  /** minLength: 6 */
  password: Scalars['String'];
  /** maxlength: 20. Should contain special characters, like: +55 (41) 98765-4321. */
  phoneNumber: Scalars['String'];
  role?: Maybe<UserRole>;
};


/** Response padrão informativo para quando não se espera dados como resposta */
export type GenericResponse = {
  __typename?: 'GenericResponse';
  userFriendlyMessage: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: TokenSet;
  createSymptomQuestionnaire: SymptomQuestionnaire;
  updateSymptomQuestionnaire: SymptomQuestionnaire;
  publishSymptomQuestionnaire: GenericResponse;
  unpublishSymptomQuestionnaire: GenericResponse;
  changeSymptomQuestionnairePublishStatus: GenericResponse;
  deleteSymptomQuestionnaire: GenericResponse;
  createSymptomQuestionnaireResponse: SymptomQuestionnaireResponse;
  registerUser: User;
  createUser: User;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateSymptomQuestionnaireArgs = {
  questionnaire: SymptomQuestionnaireInput;
};


export type MutationUpdateSymptomQuestionnaireArgs = {
  id: Scalars['ID'];
  questionnaire: SymptomQuestionnaireInput;
};


export type MutationPublishSymptomQuestionnaireArgs = {
  id: Scalars['ID'];
};


export type MutationUnpublishSymptomQuestionnaireArgs = {
  id: Scalars['ID'];
};


export type MutationChangeSymptomQuestionnairePublishStatusArgs = {
  isPublished: Scalars['Boolean'];
  id: Scalars['ID'];
};


export type MutationDeleteSymptomQuestionnaireArgs = {
  id: Scalars['ID'];
};


export type MutationCreateSymptomQuestionnaireResponseArgs = {
  response: SymptomQuestionnaireResponseInput;
};


export type MutationRegisterUserArgs = {
  userData: RegisterUserInput;
};


export type MutationCreateUserArgs = {
  userData: CreateUserInput;
};

export type OrderByClause = {
  columnName: Scalars['String'];
  direction?: Maybe<OrderByClauseDirection>;
  nulls?: Maybe<OrderByClauseNullsPosition>;
};

export enum OrderByClauseDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum OrderByClauseNullsPosition {
  NullsFirst = 'NULLS_FIRST',
  NullsLast = 'NULLS_LAST'
}

export type PaginatedSymptomQuestionnaireResponses = {
  __typename?: 'PaginatedSymptomQuestionnaireResponses';
  totalResultsCount: Scalars['Int'];
  hasMorePages: Scalars['Boolean'];
  results: Array<SymptomQuestionnaireResponse>;
};

export type PaginatedSymptomQuestionnaires = {
  __typename?: 'PaginatedSymptomQuestionnaires';
  totalResultsCount: Scalars['Int'];
  hasMorePages: Scalars['Boolean'];
  results: Array<SymptomQuestionnaire>;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  totalResultsCount: Scalars['Int'];
  hasMorePages: Scalars['Boolean'];
  results: Array<User>;
};

export type Query = {
  __typename?: 'Query';
  authorizationToken: Scalars['String'];
  symptomQuestionnaires: PaginatedSymptomQuestionnaires;
  symptomQuestionnaire: SymptomQuestionnaire;
  symptomQuestionnaireResponses: PaginatedSymptomQuestionnaireResponses;
  currentUser?: Maybe<User>;
  user?: Maybe<User>;
  users: PaginatedUsers;
};


export type QueryAuthorizationTokenArgs = {
  refreshToken: Scalars['String'];
};


export type QuerySymptomQuestionnairesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  nameForManagement?: Maybe<Scalars['String']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  currentVersionsOnly?: Maybe<Scalars['Boolean']>;
  withDeleted?: Maybe<Scalars['Boolean']>;
  pageNumber?: Maybe<Scalars['Int']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
};


export type QuerySymptomQuestionnaireArgs = {
  id: Scalars['ID'];
};


export type QuerySymptomQuestionnaireResponsesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  patientId?: Maybe<Scalars['ID']>;
  responseDateAfter?: Maybe<Scalars['DateTime']>;
  responseDateBefore?: Maybe<Scalars['DateTime']>;
  withDeleted?: Maybe<Scalars['Boolean']>;
  pageNumber?: Maybe<Scalars['Int']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
  withDeleted?: Maybe<Scalars['Boolean']>;
  pageNumber?: Maybe<Scalars['Int']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
};

/** Required data to register an application user from the register form */
export type RegisterUserInput = {
  /** maxLength: 500 */
  name: Scalars['String'];
  /** maxLength: 500 */
  email: Scalars['String'];
  /** minLength: 6, maxLength: 500 */
  password: Scalars['String'];
  /** maxlength: 20. Should contain special characters, like: +55 (41) 98765-4321. */
  phoneNumber: Scalars['String'];
};

export type ResponseScore = {
  __typename?: 'ResponseScore';
  /** Numerical value. */
  value: Scalars['Int'];
  color: SymptomQuestionnaireScoreRangeColor;
  /** Title of this range to be shown to users. Could be "Good", "Bad", etc. */
  title: Scalars['String'];
  /** Description of this range to be shown to users. */
  description: Scalars['String'];
};

export type SymptomQuestionnaire = {
  __typename?: 'SymptomQuestionnaire';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  nameForManagement: Scalars['String'];
  nameForPresentation: Scalars['String'];
  version: Scalars['Int'];
  isPublished: Scalars['Boolean'];
  questions: Array<SymptomQuestionnaireQuestion>;
  responses: Array<SymptomQuestionnaireResponse>;
  scoreRanges: Array<SymptomQuestionnaireScoreRange>;
};

export type SymptomQuestionnaireInput = {
  nameForManagement: Scalars['String'];
  nameForPresentation: Scalars['String'];
  isPublished?: Maybe<Scalars['Boolean']>;
  questions: Array<SymptomQuestionnaireQuestionInput>;
  scoreRanges: Array<SymptomQuestionnaireScoreRangeInput>;
};

export type SymptomQuestionnaireQuestion = {
  __typename?: 'SymptomQuestionnaireQuestion';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** Question name only for internal use. Only admins will see this. */
  nameForManagement: Scalars['String'];
  /** Question text, what will be shown to the user. Localization is not a concern. */
  text: Scalars['String'];
  kind: SymptomQuestionnaireQuestionKind;
  possibleChoices?: Maybe<Array<SymptomQuestionnaireQuestionChoice>>;
  presentationOrder: Scalars['Int'];
};

export type SymptomQuestionnaireQuestionChoice = {
  __typename?: 'SymptomQuestionnaireQuestionChoice';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** Choice name only for internal use. Only questionnaire-creator admins will see this. */
  nameForManagement: Scalars['String'];
  /** Choice text, what will be shown to the user. Localization is not a concern. */
  text: Scalars['String'];
  /** When the questionnaire is answered, this field is used to calculate the result. */
  value: Scalars['Int'];
  presentationOrder: Scalars['Int'];
};

export type SymptomQuestionnaireQuestionChoiceInput = {
  nameForManagement: Scalars['String'];
  text: Scalars['String'];
  value: Scalars['Int'];
  presentationOrder: Scalars['Int'];
};

export type SymptomQuestionnaireQuestionInput = {
  nameForManagement: Scalars['String'];
  text: Scalars['String'];
  kind: SymptomQuestionnaireQuestionKind;
  possibleChoices?: Maybe<Array<SymptomQuestionnaireQuestionChoiceInput>>;
  presentationOrder: Scalars['Int'];
};

export enum SymptomQuestionnaireQuestionKind {
  MultipleChoice = 'MULTIPLE_CHOICE',
  FreeResponse = 'FREE_RESPONSE'
}

export type SymptomQuestionnaireResponse = {
  __typename?: 'SymptomQuestionnaireResponse';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  responseDate: Scalars['DateTime'];
  patient: User;
  questionnaire: SymptomQuestionnaire;
  questionAnswers: Array<SymptomQuestionnaireResponseAnswer>;
  score: ResponseScore;
};

export type SymptomQuestionnaireResponseAnswer = {
  __typename?: 'SymptomQuestionnaireResponseAnswer';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  response: SymptomQuestionnaireResponse;
  question: SymptomQuestionnaireQuestion;
  selectedChoice?: Maybe<SymptomQuestionnaireQuestionChoice>;
  writtenText?: Maybe<Scalars['String']>;
};

export type SymptomQuestionnaireResponseAnswerInput = {
  questionId: Scalars['ID'];
  choiceId: Scalars['ID'];
  /** Can be null, in cases where the answer has multiple choices */
  writtenText?: Maybe<Scalars['String']>;
};

export type SymptomQuestionnaireResponseInput = {
  /** DateTime in ISO-8601 format: 2020-12-31T23:59:59+0300 */
  responseDate: Scalars['DateTime'];
  userId: Scalars['ID'];
  questionnaireId: Scalars['ID'];
  questionnaireVersion: Scalars['Int'];
  questionAnswers: Array<SymptomQuestionnaireResponseAnswerInput>;
};

export type SymptomQuestionnaireScoreRange = {
  __typename?: 'SymptomQuestionnaireScoreRange';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  questionnaire: SymptomQuestionnaire;
  /** Minimum score value in order for response to be included in this range. */
  minScore: Scalars['Int'];
  /** Maximum score value in order for response to be included in this range. */
  maxScore: Scalars['Int'];
  color: SymptomQuestionnaireScoreRangeColor;
  /** Title of this range to be shown to users. Could be "Good", "Bad", etc. */
  title: Scalars['String'];
  /** Description of this range to be shown to users. */
  description: Scalars['String'];
};

export enum SymptomQuestionnaireScoreRangeColor {
  Green = 'GREEN',
  GreenYellow = 'GREEN_YELLOW',
  Yellow = 'YELLOW',
  Orange = 'ORANGE',
  Red = 'RED'
}

export type SymptomQuestionnaireScoreRangeInput = {
  minScore: Scalars['Int'];
  maxScore: Scalars['Int'];
  color: SymptomQuestionnaireScoreRangeColor;
  /** maxLength: 500 */
  title: Scalars['String'];
  /** maxLength: 2000 */
  description: Scalars['String'];
};

export type TokenSet = {
  __typename?: 'TokenSet';
  authorization: Scalars['String'];
  refresh: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  /** Unique email address used for logging in */
  email: Scalars['String'];
  /** Should contain special characters, like: +55 (41) 98765-4321 */
  phoneNumber: Scalars['String'];
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  Doctor = 'DOCTOR',
  Patient = 'PATIENT'
}

export type ChangePublishStatusMutationVariables = {
  id: Scalars['ID'];
  isPublished: Scalars['Boolean'];
};


export type ChangePublishStatusMutation = (
  { __typename?: 'Mutation' }
  & { changeSymptomQuestionnairePublishStatus: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type CreateSymptomQuestionnaireMutationVariables = {
  questionnaire: SymptomQuestionnaireInput;
};


export type CreateSymptomQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { createSymptomQuestionnaire: (
    { __typename?: 'SymptomQuestionnaire' }
    & Pick<SymptomQuestionnaire, 'id'>
  ) }
);

export type DeleteQuestionnaireMutationVariables = {
  id: Scalars['ID'];
};


export type DeleteQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { deleteSymptomQuestionnaire: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type PublishSymptomQuestionnaireMutationVariables = {
  id: Scalars['ID'];
};


export type PublishSymptomQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { publishSymptomQuestionnaire: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type UnpublishSymptomQuestionnaireMutationVariables = {
  id: Scalars['ID'];
};


export type UnpublishSymptomQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { unpublishSymptomQuestionnaire: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type UpdateQuestionnaireMutationVariables = {
  id: Scalars['ID'];
  questionnaire: SymptomQuestionnaireInput;
};


export type UpdateQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { updateSymptomQuestionnaire: (
    { __typename?: 'SymptomQuestionnaire' }
    & Pick<SymptomQuestionnaire, 'id'>
  ) }
);

export type CreateUserMutationVariables = {
  userData: CreateUserInput;
};


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<User, 'id'>
  ) }
);

export type LoginMutationVariables = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'TokenSet' }
    & Pick<TokenSet, 'authorization' | 'refresh'>
  ) }
);

export type CurrentSymptomQuestionnairesQueryVariables = {
  name?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Array<OrderByClause>>;
  pageNumber?: Maybe<Scalars['Int']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
};


export type CurrentSymptomQuestionnairesQuery = (
  { __typename?: 'Query' }
  & { symptomQuestionnaires: (
    { __typename?: 'PaginatedSymptomQuestionnaires' }
    & Pick<PaginatedSymptomQuestionnaires, 'hasMorePages' | 'totalResultsCount'>
    & { results: Array<(
      { __typename?: 'SymptomQuestionnaire' }
      & Pick<SymptomQuestionnaire, 'id' | 'nameForManagement' | 'nameForPresentation' | 'createdAt' | 'updatedAt' | 'version' | 'isPublished'>
      & { questions: Array<(
        { __typename?: 'SymptomQuestionnaireQuestion' }
        & Pick<SymptomQuestionnaireQuestion, 'nameForManagement'>
      )> }
    )> }
  ) }
);

export type GetQuestionnaireQueryVariables = {
  id: Scalars['ID'];
};


export type GetQuestionnaireQuery = (
  { __typename?: 'Query' }
  & { symptomQuestionnaire: (
    { __typename?: 'SymptomQuestionnaire' }
    & Pick<SymptomQuestionnaire, 'id' | 'isPublished' | 'nameForManagement' | 'nameForPresentation'>
    & { questions: Array<(
      { __typename?: 'SymptomQuestionnaireQuestion' }
      & Pick<SymptomQuestionnaireQuestion, 'id' | 'kind' | 'nameForManagement' | 'presentationOrder' | 'text'>
      & { possibleChoices?: Maybe<Array<(
        { __typename?: 'SymptomQuestionnaireQuestionChoice' }
        & Pick<SymptomQuestionnaireQuestionChoice, 'id' | 'nameForManagement' | 'text' | 'presentationOrder' | 'value'>
      )>> }
    )>, scoreRanges: Array<(
      { __typename?: 'SymptomQuestionnaireScoreRange' }
      & Pick<SymptomQuestionnaireScoreRange, 'id' | 'color' | 'title' | 'minScore' | 'maxScore' | 'description'>
    )> }
  ) }
);

export type CurrentUserFullInfoQueryVariables = {};


export type CurrentUserFullInfoQuery = (
  { __typename?: 'Query' }
  & { currentUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'name' | 'email' | 'phoneNumber' | 'role'>
  )> }
);

export type PatientOverviewQueryVariables = {
  id: Scalars['ID'];
};


export type PatientOverviewQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'name' | 'email' | 'phoneNumber' | 'createdAt'>
  )>, symptomQuestionnaireResponses: (
    { __typename?: 'PaginatedSymptomQuestionnaireResponses' }
    & Pick<PaginatedSymptomQuestionnaireResponses, 'totalResultsCount' | 'hasMorePages'>
    & { results: Array<(
      { __typename?: 'SymptomQuestionnaireResponse' }
      & Pick<SymptomQuestionnaireResponse, 'responseDate'>
      & { score: (
        { __typename?: 'ResponseScore' }
        & Pick<ResponseScore, 'value' | 'color' | 'title'>
      ), questionnaire: (
        { __typename?: 'SymptomQuestionnaire' }
        & Pick<SymptomQuestionnaire, 'nameForPresentation'>
      ) }
    )> }
  ) }
);

export type PatientsQueryVariables = {
  name?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Array<OrderByClause>>;
  pageNumber?: Maybe<Scalars['Int']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
};


export type PatientsQuery = (
  { __typename?: 'Query' }
  & { users: (
    { __typename?: 'PaginatedUsers' }
    & Pick<PaginatedUsers, 'hasMorePages' | 'totalResultsCount'>
    & { results: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'createdAt' | 'email' | 'name' | 'phoneNumber'>
    )> }
  ) }
);
