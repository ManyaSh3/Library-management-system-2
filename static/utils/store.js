const store = new Vuex.Store({
  state: {
    loggedIn: false,
    role: "",
    token: "", // Add token state
  },

  mutations: {
    setLogin(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
      state.token = ""; // Reset token on logout
    },
    setRole(state, role) {
      state.role = role;
    },
    setToken(state, token) { // Add setToken mutation
      state.token = token;
    },
  },
});

export default store;
