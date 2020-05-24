import { Middleware } from '@nuxt/types';

const isUserGuestMiddleware: Middleware = ({ app, redirect }) => {
  const hasToken = !!app.$apolloHelpers.getToken();
  if (hasToken) redirect('/');
};

export default isUserGuestMiddleware;
