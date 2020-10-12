import { Middleware } from '@nuxt/types';
import { UserRole } from '~/types/gql';

const isUserAdminMiddleware: Middleware = ({ app, redirect }) => {
  const isUserAdmin = app.$accessor.currentUser.currentUser?.role === UserRole.Admin;
  if (!isUserAdmin) redirect('/auth/login');
};

export default isUserAdminMiddleware;
