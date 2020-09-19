/* eslint-disable import/prefer-default-export */
import { replace, toPairs } from 'lodash';

export function replaceParamsInPath(path: string, params: Record<string, string>): string {
  let finalPathString = path;

  toPairs(params).forEach(([paramName, paramValue]) => {
    const pattern = `:${paramName}`;
    finalPathString = replace(finalPathString, pattern, paramValue);
  });

  return finalPathString;
}
