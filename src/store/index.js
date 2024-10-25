import { createStore } from 'vuex';

const store = createStore({
  state: {
    successTittle: '',
    successMessage: '',
    successStatus: null,
    permissions: [],
    menus: [],
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
  }
});

export default store;
