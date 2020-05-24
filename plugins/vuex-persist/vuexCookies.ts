import { Context } from '@nuxt/types';
import SecureLS from 'secure-ls';
import createPersistedState from 'vuex-persistedstate';
import { NuxtExtendedWindow } from '~/types/modules';

const ls = new SecureLS({ isCompression: false });

export default ({ store }: Context) => {
  (window as typeof window & NuxtExtendedWindow).onNuxtReady(() => {
    createPersistedState({
      key: 'vuex',
      paths: ['auth.refreshToken'],
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    })(store);
  });
};
