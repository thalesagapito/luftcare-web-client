import { Context } from '@nuxt/types';
import createPersistedState from 'vuex-persistedstate';
import { NuxtExtendedWindow } from '~/types/modules';

export default ({ store }: Context) => {
  (window as typeof window & NuxtExtendedWindow).onNuxtReady(() => {
    createPersistedState({
      key: 'vuex',
      paths: ['layout'],
    })(store);
  });
};
