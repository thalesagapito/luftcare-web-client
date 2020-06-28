import { FetchResult } from 'apollo-link'; // mutation
import { ApolloQueryResult, ApolloError } from 'apollo-client'; // query
import { Mutation, Query } from './gql';

export type Nullable<T> = T | undefined;
export type NullablePromise<T> = Promise<T | undefined>;
export type Keyed<T> = T & { key: string };
export type WithIsValid<T> = T & { isValid: boolean };
export type OmitFrom<T, K extends keyof T> = Omit<T, K>;
export type Override<T, U> = Omit<T, keyof U> & U;
export type UpdateFieldWithValueFunction<T> = <K extends keyof T>(field: K, value: T[K]) => void;

// Graphql response handlers
type HandlerFunction<T> = (args: T) => void;
// Query
type QueryResponse<T> = ApolloQueryResult<T>; // must be equal to DollarApollo query function return type
export type QueryResponseHandlers<T> = {
  Success: HandlerFunction<QueryResponse<Query>>;
  Error: HandlerFunction<ApolloError>;
};
// Mutation
type MutationResponse<T> = FetchResult<T>; // must be equal to DollarApollo mutate function return type
export type MutationResponseHandler = {
  Success: HandlerFunction<MutationResponse<Mutation>>;
  Error: HandlerFunction<ApolloError>;
};
