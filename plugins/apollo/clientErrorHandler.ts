/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import { GraphQLError } from 'graphql';
import { ApolloError } from 'apollo-client';
import { log } from '~/logs/LogHandler';

const SERVER_ERROR = 'ServerError';
const VALIDATION_ERROR = 'GraphQL error: Argument Validation Error';

function handleNetworkError(error: ApolloError) {
  const serverResponded = error.networkError?.name === SERVER_ERROR;
  if (serverResponded) {
    log('Erro no servidor', error);
  } else {
    log('Sem conexão ou o servidor está fora do ar', error);
  }
}

function handleValidationError(errors: Readonly<GraphQLError[]>) {
  errors.forEach((graphqlError) => {
    const { validationErrors = [] } = graphqlError?.extensions?.exception;
    validationErrors.forEach((e: any) => log('Validation error', e));
  });
}

function errorHandler(error: ApolloError): void {
  const { message, graphQLErrors, networkError } = error;

  const isNetworkError = networkError !== null && networkError !== undefined;
  const isValidationError = message === VALIDATION_ERROR;

  if (isNetworkError) return handleNetworkError(error);
  if (isValidationError) return handleValidationError(graphQLErrors);

  return log('Unhandled error', error);
}

Vue.prototype.$clientErrorHandler = errorHandler;
export const clientErrorHandler = errorHandler;
