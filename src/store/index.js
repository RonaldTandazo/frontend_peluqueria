import { createStore } from 'vuex';

const store = createStore({
  state: {
    successTittle: '',
    successMessage: '',
    successStatus: null,
    permissions: [],
    menus: [],
    userData: {},
    locatedMenu: {}
  },
  mutations: {
    setSuccessMessage(state, payload) {
      state.successTittle = payload.tittle;
      state.successMessage = payload.message;
      state.successStatus = payload.status;
    },
    setPermissions(state, permissions) {
      state.permissions = permissions;
    },
    setMenus(state, menus) {
      state.menus = menus;
    },
    setUserData(state, userData) {
      state.userData = userData;
    },
    setLocatedMenu(state, menu) {
      state.locatedMenu = menu;
    }
  },
  actions: {
    updatePermissions({ commit }, permissions) {
      commit('setPermissions', permissions);
    },
    updateMenus({ commit }, menus) {
      commit('setMenus', menus);
    },
    updateUserData({ commit }, userData) {
      commit('setUserData', userData);
    },
    updatedLocatedMenu({ commit }, locatedMenu) {
      commit('setLocatedMenu', locatedMenu);
    }
  },
  getters: {
    getSuccessMessage(state) {
      return state.successMessage;
    },
    getSuccessTittle(state) {
      return state.successTittle;
    },
    getSuccessStatus(state){
      return state.successStatus;
    },
    getPermissions: (state) => state.permissions,
    getMenus: (state) => state.menus,
    getUserData: (state) => state.userData,
    getLocatedMenu: (state) => state.locatedMenu
  }
});

export default store;
