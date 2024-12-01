import { createStore } from 'vuex';
import auth from './modules/auth';
import location from './modules/location';

const store = createStore({
  modules: {
    auth,
    location
  },
  state: {
    successTittle: '',
    successMessage: '',
    successStatus: null
  },
  mutations: {
    setSuccessMessage(state, payload) {
      state.successTittle = payload.tittle;
      state.successMessage = payload.message;
      state.successStatus = payload.status;
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
    }
  }
});

export default store;
