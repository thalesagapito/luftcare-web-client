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
  registerUser: User;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationCreateSymptomQuestionnaireArgs = {
  questionnaire: SymptomQuestionnaireInput;
};


export type MutationUpdateSymptomQuestionnaireArgs = {
  idSharedBetweenVersions: Scalars['ID'];
  questionnaire: SymptomQuestionnaireInput;
};


export type MutationPublishSymptomQuestionnaireArgs = {
  id: Scalars['String'];
};


export type MutationUnpublishSymptomQuestionnaireArgs = {
  id: Scalars['String'];
};


export type MutationChangeSymptomQuestionnairePublishStatusArgs = {
  isPublished: Scalars['Boolean'];
  id: Scalars['String'];
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

export type PaginatedSymptomQuestionnaireResponse = {
  __typename?: 'PaginatedSymptomQuestionnaireResponse';
  totalResultsCount: Scalars['Int'];
  hasMorePages: Scalars['Boolean'];
  results: Array<SymptomQuestionnaire>;
};

export type Query = {
  __typename?: 'Query';
  authorizationToken: Scalars['String'];
  symptomQuestionnaires: PaginatedSymptomQuestionnaireResponse;
  currentUser?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};


export type QueryAuthorizationTokenArgs = {
  refreshToken: Scalars['String'];
};


export type QuerySymptomQuestionnairesArgs = {
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

export type SymptomQuestionnaire = {
  __typename?: 'SymptomQuestionnaire';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  idSharedBetweenVersions: Scalars['ID'];
  nameForManagement: Scalars['String'];
  nameForPresentation: Scalars['String'];
  version: Scalars['Int'];
  isPublished: Scalars['Boolean'];
  questions?: Maybe<Array<SymptomQuestionnaireQuestion>>;
};

export type SymptomQuestionnaireInput = {
  nameForManagement: Scalars['String'];
  nameForPresentation: Scalars['String'];
  isPublished?: Maybe<Scalars['Boolean']>;
  questions: Array<SymptomQuestionnaireQuestionInput>;
};

export type SymptomQuestionnaireQuestion = {
  __typename?: 'SymptomQuestionnaireQuestion';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
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
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
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
    { __typename?: 'PaginatedSymptomQuestionnaireResponse' }
    & Pick<PaginatedSymptomQuestionnaireResponse, 'hasMorePages' | 'totalResultsCount'>
    & { results: Array<(
      { __typename?: 'SymptomQuestionnaire' }
      & Pick<SymptomQuestionnaire, 'id' | 'nameForManagement' | 'nameForPresentation' | 'createdAt' | 'updatedAt' | 'version'>
      & { questions?: Maybe<Array<(
        { __typename?: 'SymptomQuestionnaireQuestion' }
        & Pick<SymptomQuestionnaireQuestion, 'nameForManagement'>
      )>> }
    )> }
  ) }
);

export type PublishSymptomQuestionnaireMutationVariables = {
  id: Scalars['String'];
};


export type PublishSymptomQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { publishSymptomQuestionnaire: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
  ) }
);

export type UnpublishSymptomQuestionnaireMutationVariables = {
  id: Scalars['String'];
};


export type UnpublishSymptomQuestionnaireMutation = (
  { __typename?: 'Mutation' }
  & { unpublishSymptomQuestionnaire: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'userFriendlyMessage'>
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
