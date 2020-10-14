export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
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
  /** MaxLength: 500 */
  name: Scalars['String'];
  /** MaxLength: 500 */
  email: Scalars['String'];
  /** MinLength: 6 */
  password: Scalars['String'];
  /** MaxLength: 20. Should contain special characters, like: +55 (41) 98765-4321. */
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
  createQuestionnaire: Questionnaire;
  updateQuestionnaire: Questionnaire;
  publishQuestionnaire: GenericResponse;
  unpublishQuestionnaire: GenericResponse;
  changeQuestionnairePublishStatus: GenericResponse;
  deleteQuestionnaire: GenericResponse;
  createQuestionnaireResponse: QuestionnaireResponse;
  registerUser: User;
  createUser: User;
  updatePassword: User;
  changeLoginCapability: GenericResponse;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateQuestionnaireArgs = {
  questionnaire: QuestionnaireInput;
};


export type MutationUpdateQuestionnaireArgs = {
  id: Scalars['ID'];
  questionnaire: QuestionnaireInput;
};


export type MutationPublishQuestionnaireArgs = {
  id: Scalars['ID'];
};


export type MutationUnpublishQuestionnaireArgs = {
  id: Scalars['ID'];
};


export type MutationChangeQuestionnairePublishStatusArgs = {
  isPublished: Scalars['Boolean'];
  id: Scalars['ID'];
};


export type MutationDeleteQuestionnaireArgs = {
  id: Scalars['ID'];
};


export type MutationCreateQuestionnaireResponseArgs = {
  response: QuestionnaireResponseInput;
};


export type MutationRegisterUserArgs = {
  userData: RegisterUserInput;
};


export type MutationCreateUserArgs = {
  userData: CreateUserInput;
};


export type MutationUpdatePasswordArgs = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationChangeLoginCapabilityArgs = {
  id: Scalars['ID'];
  canLogin: Scalars['Boolean'];
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

export type PaginatedQuestionnaireResponses = {
  __typename?: 'PaginatedQuestionnaireResponses';
  totalResultsCount: Scalars['Int'];
  hasMorePages: Scalars['Boolean'];
  results: Array<QuestionnaireResponse>;
};

export type PaginatedQuestionnaires = {
  __typename?: 'PaginatedQuestionnaires';
  totalResultsCount: Scalars['Int'];
  hasMorePages: Scalars['Boolean'];
  results: Array<Questionnaire>;
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
  questionnaires: PaginatedQuestionnaires;
  questionnaire: Questionnaire;
  questionnaireResponses: PaginatedQuestionnaireResponses;
  currentUser?: Maybe<User>;
  user?: Maybe<User>;
  users: PaginatedUsers;
};


export type QueryAuthorizationTokenArgs = {
  refreshToken: Scalars['String'];
};


export type QueryQuestionnairesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  nameForManagement?: Maybe<Scalars['String']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  currentVersionsOnly?: Maybe<Scalars['Boolean']>;
  withDeleted?: Maybe<Scalars['Boolean']>;
  pageNumber?: Maybe<Scalars['Int']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
};


export type QueryQuestionnaireArgs = {
  id: Scalars['ID'];
};


export type QueryQuestionnaireResponsesArgs = {
  orderBy?: Maybe<Array<OrderByClause>>;
  userId?: Maybe<Scalars['ID']>;
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

export type Questionnaire = {
  __typename?: 'Questionnaire';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  nameForManagement: Scalars['String'];
  nameForPresentation: Scalars['String'];
  description: Scalars['String'];
  version: Scalars['Int'];
  estimatedDurationInMinutes: Scalars['Int'];
  isPublished: Scalars['Boolean'];
  questions: Array<QuestionnaireQuestion>;
  responses: Array<QuestionnaireResponse>;
  scoreRanges: Array<QuestionnaireScoreRange>;
};

export type QuestionnaireInput = {
  nameForManagement: Scalars['String'];
  nameForPresentation: Scalars['String'];
  isPublished?: Maybe<Scalars['Boolean']>;
  questions: Array<QuestionnaireQuestionInput>;
  scoreRanges: Array<QuestionnaireScoreRangeInput>;
};

export type QuestionnaireQuestion = {
  __typename?: 'QuestionnaireQuestion';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  /** Question name only for internal use. Only admins will see this. */
  nameForManagement: Scalars['String'];
  /** Question text, what will be shown to the user. Localization is not a concern. */
  text: Scalars['String'];
  kind: QuestionnaireQuestionKind;
  possibleChoices?: Maybe<Array<QuestionnaireQuestionChoice>>;
  presentationOrder: Scalars['Int'];
};

export type QuestionnaireQuestionChoice = {
  __typename?: 'QuestionnaireQuestionChoice';
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

export type QuestionnaireQuestionChoiceInput = {
  nameForManagement: Scalars['String'];
  text: Scalars['String'];
  value: Scalars['Int'];
  presentationOrder: Scalars['Int'];
};

export type QuestionnaireQuestionInput = {
  nameForManagement: Scalars['String'];
  text: Scalars['String'];
  kind: QuestionnaireQuestionKind;
  possibleChoices?: Maybe<Array<QuestionnaireQuestionChoiceInput>>;
  presentationOrder: Scalars['Int'];
};

export enum QuestionnaireQuestionKind {
  MultipleChoice = 'MULTIPLE_CHOICE',
  FreeResponse = 'FREE_RESPONSE'
}

export type QuestionnaireResponse = {
  __typename?: 'QuestionnaireResponse';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  responseDate: Scalars['DateTime'];
  patient: User;
  questionnaire: Questionnaire;
  questionAnswers: QuestionnaireResponseAnswer;
  score: ResponseScore;
};

export type QuestionnaireResponseAnswer = {
  __typename?: 'QuestionnaireResponseAnswer';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  response: QuestionnaireResponse;
  question: QuestionnaireQuestion;
  selectedChoice?: Maybe<QuestionnaireQuestionChoice>;
  writtenText?: Maybe<Scalars['String']>;
};

export type QuestionnaireResponseAnswerInput = {
  questionId: Scalars['ID'];
  choiceId: Scalars['ID'];
  /** Can be null, in cases where the answer has multiple choices */
  writtenText?: Maybe<Scalars['String']>;
};

export type QuestionnaireResponseInput = {
  /** DateTime in ISO-8601 format: 2020-12-31T23:59:59+0300 */
  responseDate: Scalars['DateTime'];
  userId: Scalars['ID'];
  questionnaireId: Scalars['ID'];
  questionnaireVersion: Scalars['Int'];
  questionAnswers: Array<QuestionnaireResponseAnswerInput>;
};

export type QuestionnaireScoreRange = {
  __typename?: 'QuestionnaireScoreRange';
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  questionnaire: Questionnaire;
  /** Minimum score value in order for response to be included in this range. */
  minScore: Scalars['Int'];
  /** Maximum score value in order for response to be included in this range. */
  maxScore: Scalars['Int'];
  color: QuestionnaireScoreRangeColor;
  /** Title of this range to be shown to users. Could be "Good", "Bad", etc. */
  title: Scalars['String'];
  /** Description of this range to be shown to users. */
  description: Scalars['String'];
};

export enum QuestionnaireScoreRangeColor {
  Green = 'GREEN',
  GreenYellow = 'GREEN_YELLOW',
  Yellow = 'YELLOW',
  Orange = 'ORANGE',
  Red = 'RED'
}

export type QuestionnaireScoreRangeInput = {
  minScore: Scalars['Int'];
  maxScore: Scalars['Int'];
  color: QuestionnaireScoreRangeColor;
  /** MaxLength: 500 */
  title: Scalars['String'];
  /** MaxLength: 2000 */
  description: Scalars['String'];
};

/** Required data to register an application user from the register form */
export type RegisterUserInput = {
  /** MaxLength: 500 */
  name: Scalars['String'];
  /** MaxLength: 500 */
  email: Scalars['String'];
  /** MinLength: 6, MaxLength: 500 */
  password: Scalars['String'];
  /** MaxLength: 20. Should contain special characters, like: +55 (41) 98765-4321. */
  phoneNumber: Scalars['String'];
};

export type ResponseScore = {
  __typename?: 'ResponseScore';
  /** Numerical value. */
  value: Scalars['Int'];
  color: QuestionnaireScoreRangeColor;
  /** Title of this range to be shown to users. Could be "Good", "Bad", etc. */
  title: Scalars['String'];
  /** Description of this range to be shown to users. */
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
  /** If the user is allowed to log in the application */
  canLogin: Scalars['Boolean'];
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  Doctor = 'DOCTOR',
  Patient = 'PATIENT'
}

export type ChangePublishStatusMutationVariables = Exact<{
  id: Scalars['ID'];
  isPublished: Scalars['Boolean'];
}>;


export type ChangePublishStatusMutation = (
  { __typename?: 'Mutation' }
  & { changeQuestionnairePublishStatus: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type CreateQuestionnaireMutationVariables = Exact<{
  questionnaire: QuestionnaireInput;
}>;


export type CreateQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { createQuestionnaire: (
    { __typename?: 'Questionnaire' }
    & Pick<Questionnaire, 'id'>
  ) }
);

export type DeleteQuestionnaireMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { deleteQuestionnaire: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type PublishQuestionnaireMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PublishQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { publishQuestionnaire: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type UnpublishQuestionnaireMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UnpublishQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { unpublishQuestionnaire: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type UpdateQuestionnaireMutationVariables = Exact<{
  id: Scalars['ID'];
  questionnaire: QuestionnaireInput;
}>;


export type UpdateQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { updateQuestionnaire: (
    { __typename?: 'Questionnaire' }
    & Pick<Questionnaire, 'id'>
  ) }
);

export type CreateUserMutationVariables = Exact<{
  userData: CreateUserInput;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<User, 'id'>
  ) }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'TokenSet' }
    & Pick<TokenSet, 'authorization' | 'refresh'>
  ) }
);

export type UpdatePasswordMutationVariables = Exact<{
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type UpdatePasswordMutation = (
  { __typename?: 'Mutation' }
  & { updatePassword: (
    { __typename?: 'User' }
    & Pick<User, 'id'>
  ) }
);

export type CurrentQuestionnairesQueryVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Array<OrderByClause>>;
  pageNumber?: Maybe<Scalars['Int']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
}>;


export type CurrentQuestionnairesQuery = (
  { __typename?: 'Query' }
  & { questionnaires: (
    { __typename?: 'PaginatedQuestionnaires' }
    & Pick<PaginatedQuestionnaires, 'hasMorePages' | 'totalResultsCount'>
    & { results: Array<(
      { __typename?: 'Questionnaire' }
      & Pick<Questionnaire, 'id' | 'nameForManagement' | 'nameForPresentation' | 'createdAt' | 'updatedAt' | 'version' | 'isPublished'>
      & { questions: Array<(
        { __typename?: 'QuestionnaireQuestion' }
        & Pick<QuestionnaireQuestion, 'nameForManagement'>
      )> }
    )> }
  ) }
);

export type GetQuestionnaireQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetQuestionnaireQuery = (
  { __typename?: 'Query' }
  & { questionnaire: (
    { __typename?: 'Questionnaire' }
    & Pick<Questionnaire, 'id' | 'isPublished' | 'nameForManagement' | 'nameForPresentation'>
    & { questions: Array<(
      { __typename?: 'QuestionnaireQuestion' }
      & Pick<QuestionnaireQuestion, 'id' | 'kind' | 'nameForManagement' | 'presentationOrder' | 'text'>
      & { possibleChoices?: Maybe<Array<(
        { __typename?: 'QuestionnaireQuestionChoice' }
        & Pick<QuestionnaireQuestionChoice, 'id' | 'nameForManagement' | 'text' | 'presentationOrder' | 'value'>
      )>> }
    )>, scoreRanges: Array<(
      { __typename?: 'QuestionnaireScoreRange' }
      & Pick<QuestionnaireScoreRange, 'id' | 'color' | 'title' | 'minScore' | 'maxScore' | 'description'>
    )> }
  ) }
);

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { currentUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'name' | 'email' | 'phoneNumber' | 'role'>
  )> }
);

export type DoctorsQueryVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Array<OrderByClause>>;
  pageNumber?: Maybe<Scalars['Int']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
}>;


export type DoctorsQuery = (
  { __typename?: 'Query' }
  & { users: (
    { __typename?: 'PaginatedUsers' }
    & Pick<PaginatedUsers, 'hasMorePages' | 'totalResultsCount'>
    & { results: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'createdAt' | 'canLogin' | 'email' | 'name' | 'phoneNumber'>
    )> }
  ) }
);

export type PatientOverviewQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type PatientOverviewQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'name' | 'email' | 'phoneNumber' | 'createdAt'>
  )>, questionnaireResponses: (
    { __typename?: 'PaginatedQuestionnaireResponses' }
    & Pick<PaginatedQuestionnaireResponses, 'totalResultsCount' | 'hasMorePages'>
    & { results: Array<(
      { __typename?: 'QuestionnaireResponse' }
      & Pick<QuestionnaireResponse, 'responseDate'>
      & { score: (
        { __typename?: 'ResponseScore' }
        & Pick<ResponseScore, 'value' | 'color' | 'title'>
      ), questionnaire: (
        { __typename?: 'Questionnaire' }
        & Pick<Questionnaire, 'nameForPresentation' | 'nameForManagement'>
      ) }
    )> }
  ) }
);

export type PatientsQueryVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Array<OrderByClause>>;
  pageNumber?: Maybe<Scalars['Int']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
}>;


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
