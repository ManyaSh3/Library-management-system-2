const store = new Vuex.Store({
  state: {
    loggedIn: JSON.parse(localStorage.getItem('loggedIn')) || false,
    role: localStorage.getItem('role') || "",
    token: localStorage.getItem('token') || "", // Retrieve token from localStorage
  },

  mutations: {
    setLogin(state) {
      state.loggedIn = true;
      localStorage.setItem('loggedIn', JSON.stringify(true)); // Persist loggedIn state
    },
    logout(state) {
      state.loggedIn = false;
      state.role = "";
      state.token = ""; // Reset token on logout
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('token'); // Remove token from localStorage
    },
    setRole(state, role) {
      state.role = role;
      localStorage.setItem('role', role); // Persist role state
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token); // Persist token in localStorage
    },
  },
});

export default store;
