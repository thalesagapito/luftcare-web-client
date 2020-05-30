import { Middleware } from '@nuxt/types';

const isUserAuthenticatedMiddleware: Middleware = ({ app, redirect }) => {
  const hasToken = !!app.$apolloHelpers.getToken();
  if (!hasToken) redirect('/auth/login');
};

export default isUserAuthenticatedMiddleware;
