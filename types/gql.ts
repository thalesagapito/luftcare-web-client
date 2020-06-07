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

export type CreateSymptomAnalysisFormInput = {
  nameForManagement: Scalars['String'];
  nameForPresentation: Scalars['String'];
  isPublished?: Maybe<Scalars['Boolean']>;
  questions: Array<CreateSymptomAnalysisFormQuestionInput>;
};

export type CreateSymptomAnalysisFormQuestionChoiceInput = {
  nameForManagement: Scalars['String'];
  text: Scalars['String'];
  value: Scalars['Int'];
  presentationOrder: Scalars['Int'];
};

export type CreateSymptomAnalysisFormQuestionInput = {
  nameForManagement: Scalars['String'];
  text: Scalars['String'];
  kind: SymptomAnalysisFormQuestionKind;
  possibleChoices?: Maybe<Array<CreateSymptomAnalysisFormQuestionChoiceInput>>;
  presentationOrder: Scalars['Int'];
};


export type Mutation = {
  __typename?: 'Mutation';
  login: TokenSet;
  createSymptomAnalysisForm: SymptomAnalysisForm;
  registerUser: User;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateSymptomAnalysisFormArgs = {
  form: CreateSymptomAnalysisFormInput;
};


export type MutationRegisterUserArgs = {
  userData: RegisterUserInput;
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

export type PaginatedSymptomAnalysisFormResponse = {
  __typename?: 'PaginatedSymptomAnalysisFormResponse';
  totalResultsCount: Scalars['Int'];
  hasMorePages: Scalars['Boolean'];
  results: Array<SymptomAnalysisForm>;
};

export type Query = {
  __typename?: 'Query';
  authorizationToken: Scalars['String'];
  symptomAnalysisForms: PaginatedSymptomAnalysisFormResponse;
  currentUser?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryAuthorizationTokenArgs = {
  refreshToken: Scalars['String'];
};


export type QuerySymptomAnalysisFormsArgs = {
  pageNumber?: Maybe<Scalars['Int']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<OrderByClause>>;
  nameForManagement?: Maybe<Scalars['String']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  currentVersionsOnly?: Maybe<Scalars['Boolean']>;
  withDeleted?: Maybe<Scalars['Boolean']>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};

/** Required data to register an application user from the register form */
export type RegisterUserInput = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  phoneNumber: Scalars['String'];
};

export type SymptomAnalysisForm = {
  __typename?: 'SymptomAnalysisForm';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  nameForManagement: Scalars['String'];
  nameForPresentation: Scalars['String'];
  version: Scalars['Int'];
  /**
   * If the form is an older version kept only to prevent integrity problems this
   * field will contain the id of the current form with the highest version
   */
  idOfCurrentVersion?: Maybe<Scalars['ID']>;
  isPublished: Scalars['Boolean'];
  questions?: Maybe<Array<SymptomAnalysisFormQuestion>>;
};

export type SymptomAnalysisFormQuestion = {
  __typename?: 'SymptomAnalysisFormQuestion';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** Question name only for internal use. Only form-creator admins will see this. */
  nameForManagement: Scalars['String'];
  /** Question text, what will be shown to the user. Localization is not a concern. */
  text: Scalars['String'];
  kind: SymptomAnalysisFormQuestionKind;
  possibleChoices?: Maybe<Array<SymptomAnalysisFormQuestionChoice>>;
  presentationOrder: Scalars['Int'];
};

export type SymptomAnalysisFormQuestionChoice = {
  __typename?: 'SymptomAnalysisFormQuestionChoice';
  id: Scalars['ID'];
  /** Choice name only for internal use. Only form-creator admins will see this. */
  nameForManagement: Scalars['String'];
  /** Choice text, what will be shown to the user. Localization is not a concern. */
  text: Scalars['String'];
  /** When the form is answered, this field is used to calculate the result. */
  value: Scalars['Int'];
  presentationOrder: Scalars['Int'];
};

export enum SymptomAnalysisFormQuestionKind {
  MultipleChoice = 'MULTIPLE_CHOICE',
  FreeResponse = 'FREE_RESPONSE'
}

export type TokenSet = {
  __typename?: 'TokenSet';
  authorization: Scalars['String'];
  refresh: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  /** Unique email address used for logging in */
  email: Scalars['String'];
  /** Has to contain special characters: +55 (41) 98765-4321 */
  phoneNumber: Scalars['String'];
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  NonAdmin = 'NON_ADMIN'
}

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

export type CurrentSymptomAnalysisFormsQueryVariables = {
  name?: Maybe<Scalars['String']>;
  orderBy?: Maybe<Array<OrderByClause>>;
  pageNumber?: Maybe<Scalars['Int']>;
  isPublished?: Maybe<Scalars['Boolean']>;
  resultsPerPage?: Maybe<Scalars['Int']>;
};


export type CurrentSymptomAnalysisFormsQuery = (
  { __typename?: 'Query' }
  & { symptomAnalysisForms: (
    { __typename?: 'PaginatedSymptomAnalysisFormResponse' }
    & Pick<PaginatedSymptomAnalysisFormResponse, 'hasMorePages' | 'totalResultsCount'>
    & { results: Array<(
      { __typename?: 'SymptomAnalysisForm' }
      & Pick<SymptomAnalysisForm, 'id' | 'nameForManagement' | 'nameForPresentation' | 'createdAt' | 'updatedAt' | 'version'>
      & { questions?: Maybe<Array<(
        { __typename?: 'SymptomAnalysisFormQuestion' }
        & Pick<SymptomAnalysisFormQuestion, 'nameForManagement'>
      )>> }
    )> }
  ) }
);

export type SymptomAnalysisFormsQueryVariables = {};


export type SymptomAnalysisFormsQuery = (
  { __typename?: 'Query' }
  & { symptomAnalysisForms: (
    { __typename?: 'PaginatedSymptomAnalysisFormResponse' }
    & { results: Array<(
      { __typename?: 'SymptomAnalysisForm' }
      & Pick<SymptomAnalysisForm, 'id' | 'nameForManagement' | 'nameForPresentation' | 'createdAt' | 'updatedAt'>
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
