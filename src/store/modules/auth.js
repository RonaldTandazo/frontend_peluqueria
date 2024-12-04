export default {
    namespaced: true,
    state: {
        userData: JSON.parse(localStorage.getItem('userData')) || {},
        permissions: JSON.parse(localStorage.getItem('permissions')) || [],
        menus: JSON.parse(localStorage.getItem('menus')) || []
    },
    mutations: {
        setUserData(state, userData) {
            state.userData = userData;
            localStorage.setItem('userData', JSON.stringify(userData));
        },
        setPermissions(state, permissions) {
            state.permissions = permissions;
            localStorage.setItem('permissions', JSON.stringify(permissions));
        },
        setMenus(state, menus) {
            state.menus = menus;
            localStorage.setItem('menus', JSON.stringify(menus));
        },
        clearAuthData(state) {
            state.userData = {};
            state.permissions = [];
            state.menus = [];
            localStorage.removeItem('userData');
            localStorage.removeItem('permissions');
            localStorage.removeItem('menus');
            localStorage.removeItem('jwt');
        },
    },
    actions: {
        login({ commit }, { userData, permissions, menus }) {
            commit('setUserData', userData);
            commit('setPermissions', permissions);
            commit('setMenus', menus);
        },
        logout({ commit }) {
            commit('clearAuthData');
        },
    },
    getters: {
        getUserData: (state) => state.userData,
        getPermissions: (state) => state.permissions,
        getMenus: (state) => state.menus,
    },
};
  