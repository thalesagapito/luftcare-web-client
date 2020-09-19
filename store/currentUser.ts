import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex';
import { CurrentUserQuery } from '~/types/gql';

type State = {
  currentUser?: CurrentUserQuery['currentUser'];
};

export const state: () => State = () => ({
  currentUser: undefined,
});

export const getters = getterTree(state, {
  currentUser: ({ currentUser }) => currentUser,
});

export const mutations = mutationTree(state, {
  SET_CURRENT_USER(state, newCurrentUser) {
    state.currentUser = newCurrentUser;
  },
  CLEAR_CURRENT_USER(state) {
    state.currentUser = undefined;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    setCurrentUser: ({ commit }, newCurrentUser) => commit('SET_CURRENT_USER', newCurrentUser),
    clearCurrentUser: ({ commit }) => commit('CLEAR_CURRENT_USER'),
  },
);
