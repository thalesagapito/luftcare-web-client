import Vue from 'vue';
import { Plugin } from '@nuxt/types';
import { GraphQLError } from 'graphql';
import { ApolloError } from 'apollo-client';
import { ElNotification } from 'element-ui/types/notification';
import { log, ExceptionSeverityLevel } from '~/logs/LogHandler';

const SERVER_ERROR = 'ServerError';
const VALIDATION_ERROR = 'GraphQL error: Argument Validation Error';

function handleNetworkError(error: ApolloError) {
  const serverResponded = error.networkError?.name === SERVER_ERROR;
  if (serverResponded) {
    log({
      message: 'Erro no servidor',
      objectToLog: error,
      severityLevel: ExceptionSeverityLevel.ERROR,
    });
  } else {
    log(
      {
        message: 'Sem conexão ou o servidor está fora do ar',
        objectToLog: error,
        severityLevel: ExceptionSeverityLevel.FATAL,
      },
    );
  }
}

function handleValidationError(errors: Readonly<GraphQLError[]>) {
  errors.forEach((graphqlError) => {
    const { validationErrors = [] } = graphqlError?.extensions?.exception;
    validationErrors.forEach((e: any) => log({
      message: 'Erro de validação',
      objectToLog: e,
      severityLevel: ExceptionSeverityLevel.INFO,
    }));
  });
}

function notifyError(message: string): void {
  (Vue.prototype.$notify as ElNotification)({ title: 'Erro', type: 'error', message });
}

export function errorHandler(error: ApolloError, enableErrorNotification: boolean = true): void {
  const { message, graphQLErrors, networkError } = error;

  const isNetworkError = networkError !== null && networkError !== undefined;
  const isValidationError = message === VALIDATION_ERROR;

  if (enableErrorNotification) notifyError(error.message);
  if (isNetworkError) return handleNetworkError(error);
  if (isValidationError) return handleValidationError(graphQLErrors);

  return log({
    message: 'Erro genérico no processamento',
    objectToLog: error,
    severityLevel: ExceptionSeverityLevel.WARNING,
  });
}

const registerClientErrorHandler: Plugin = (context, inject) => {
  inject('clientErrorHandler', errorHandler);
};


export default registerClientErrorHandler;
