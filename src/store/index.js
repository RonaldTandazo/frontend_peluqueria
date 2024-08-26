import { createStore } from 'vuex';

const store = createStore({
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
