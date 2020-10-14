import { getAccessorType } from 'typed-vuex';

import * as auth from '~/store/auth';
import * as layout from '~/store/layout';
import * as currentUser from '~/store/currentUser';
import nuxtServerInit from '~/store/nuxtServerInit';

export const accessorType = getAccessorType({
  modules: {
    auth,
    layout,
    currentUser,
  },
});

export default {
  actions: { nuxtServerInit },
};
