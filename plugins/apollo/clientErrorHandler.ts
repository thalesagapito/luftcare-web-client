import Vue from 'vue';
import { GraphQLError } from 'graphql';
import { ApolloError } from 'apollo-client';
import { ElNotification } from 'element-ui/types/notification';
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

function notifyError(message: string): void {
  (Vue.prototype.$notify as ElNotification)({
    title: 'Erro',
    type: 'error',
    message,
  });
}

function errorHandler(error: ApolloError, enableErrorNotification: boolean = true): void {
  const { message, graphQLErrors, networkError } = error;

  const isNetworkError = networkError !== null && networkError !== undefined;
  const isValidationError = message === VALIDATION_ERROR;

  if (enableErrorNotification) notifyError(error.message);
  if (isNetworkError) return handleNetworkError(error);
  if (isValidationError) return handleValidationError(graphQLErrors);

  return log('Processing error', error);
}

type CustomHandler = (error: ApolloError) => void;

function customErrorHandler(customHandler: CustomHandler): typeof errorHandler {
  return (error: ApolloError) => {
    errorHandler(error);
    customHandler(error);
  };
}

Vue.prototype.$defaultClientErrorHandler = errorHandler;
Vue.prototype.$customClientErrorHandler = customErrorHandler;
export const defaultClientErrorHandler = errorHandler;
export const customClientErrorHandler = customErrorHandler;
