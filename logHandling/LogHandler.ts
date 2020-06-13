/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import safeStringify from 'json-stringify-safe';
import { ProcessEnv } from '~/types/modules';

export enum ExceptionSeverityLevel {
  /**
   * A severe error that causes your system to crash,
   * resulting in the loss or corruption of unsaved data.
   */
  FATAL = 'FATAL',
  /**
   * A severe error that might cause the loss or corruption of unsaved data.
   * Immediate action must be taken to prevent losing data.
   */
  ERROR = 'ERROR',
  // Action must be taken at some stage to prevent a severe error from occurring in the future.
  WARNING = 'WARNING',
  /**
   * An informative message, usually describing server activity.
   * No action is necessary.
   */
  INFO = 'INFO'
}

type LoggingMethodArgs = {
  message: string;
  severityLevel: ExceptionSeverityLevel;
  objectToLog?: any;
};
type LoggingMethod = (args: LoggingMethodArgs) => void ;


const stringify = (ob?: any) => safeStringify(ob, undefined, 2);
const concatMessageWithSeverity = (message: string, level: ExceptionSeverityLevel) => `${level} - ${message}`;

const logToConsole = ({ message, severityLevel, objectToLog } : LoggingMethodArgs) => {
  const logMessage = concatMessageWithSeverity(message, severityLevel);
  console.log(logMessage);

  if (!objectToLog) return;

  const objectString = stringify(objectToLog);
  console.log(objectString);
};


const loggingMethods: { [name: string]: LoggingMethod } = {
  dev(args: LoggingMethodArgs) {
    logToConsole(args);
  },
  staging(args: LoggingMethodArgs) {
    // TODO create staging logging solution here
    logToConsole(args);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prod(args: LoggingMethodArgs) {
    // TODO create prod logging solution
  },
};

const { ENV } = (process.env as ProcessEnv);

export const log = loggingMethods[ENV] || loggingMethods.dev;
