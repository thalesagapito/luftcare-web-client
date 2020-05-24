import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex';

export const state = () => ({
  refreshToken: undefined,
});

export const getters = getterTree(state, {
  isLoggedIn: ({ refreshToken }) => !!refreshToken,
});

export const mutations = mutationTree(state, {
  SET_REFRESH_TOKEN(state, newRefreshToken) {
    state.refreshToken = newRefreshToken;
  },
  CLEAR_REFRESH_TOKEN(state) {
    state.refreshToken = undefined;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    setRefreshToken: ({ commit }, newRefreshToken) => commit('SET_REFRESH_TOKEN', newRefreshToken),
    clearRefreshToken: ({ commit }) => commit('CLEAR_REFRESH_TOKEN'),
  },
);
