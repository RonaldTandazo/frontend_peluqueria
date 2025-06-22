export default {
    namespaced: true,
    state: {
        locatedMenu: {}
    },
    mutations: {
        setLocatedMenu(state, menu) {
            state.locatedMenu = menu;
        },
    },
    actions:{
        located({ commit }, menu) {
            commit('setLocatedMenu', menu);
        },
    },
    getters: {
        getLocatedMenu: (state) => state.locatedMenu
    },
};
  