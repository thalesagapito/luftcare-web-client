import { getAccessorType } from 'typed-vuex';

import * as auth from '~/store/auth';
import * as layout from '~/store/layout';
import * as currentUser from '~/store/currentUser';

// eslint-disable-next-line import/prefer-default-export
export const accessorType = getAccessorType({
  modules: {
    auth,
    layout,
    currentUser,
  },
});
