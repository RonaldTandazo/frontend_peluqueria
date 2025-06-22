export default {
    namespaced: true,
    state: {
        userData: JSON.parse(localStorage.getItem('userData')) || {}
    },
    mutations: {
        setUserData(state, userData) {
            state.userData = userData;
            localStorage.setItem('userData', JSON.stringify(userData));
        },
        clearAuthData(state) {
            state.userData = {};
            localStorage.removeItem('userData');
            localStorage.removeItem('jwt');
        },
    },
    actions: {
        login({ commit }, { userData }) {
            commit('setUserData', userData);
        },
        logout({ commit }) {
            commit('clearAuthData');
        },
    },
    getters: {
        getUserData: (state) => state.userData,
    },
};
  