import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex';

export const state = () => ({
  isMenuDrawerOpen: true,
});

export const getters = getterTree(state, {
  isMenuDrawerOpen: ({ isMenuDrawerOpen }) => isMenuDrawerOpen,
});

export const mutations = mutationTree(state, {
  OPEN_MENU_DRAWER(state) {
    state.isMenuDrawerOpen = true;
  },
  CLOSE_MENU_DRAWER(state) {
    state.isMenuDrawerOpen = false;
  },
});
export const actions = actionTree(
  { state, getters, mutations },
  {
    openMenuDrawer: ({ commit }) => commit('OPEN_MENU_DRAWER'),
    closeMenuDrawer: ({ commit }) => commit('CLOSE_MENU_DRAWER'),
    toggleMenuDrawer({ commit, state }) {
      if (state.isMenuDrawerOpen) {
        commit('CLOSE_MENU_DRAWER');
        return;
      }
      commit('OPEN_MENU_DRAWER');
    },
  },
);
