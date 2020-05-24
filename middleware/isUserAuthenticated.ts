import { Middleware } from '@nuxt/types';

const isUserAuthenticatedMiddleware: Middleware = ({ app, error }) => {
  const hasToken = !!app.$apolloHelpers.getToken();
  if (!hasToken) {
    error({ statusCode: 503, message: 'You are not allowed to see this' });
  }
};

export default isUserAuthenticatedMiddleware;
