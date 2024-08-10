import store from "../utils/store.js";

const Navbar = {
  template: `
    <nav style="background-color: #333; padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <!-- Library Management System Button on the left -->
      <router-link to="/" style="color: white; text-decoration: none; padding: 0.5rem 1rem; background-color: #444; border-radius: 4px; transition: background-color 0.3s;">Library Management System</router-link>
      
      <!-- Navigation links on the right -->
      <ul style="list-style-type: none; margin: 0; padding: 0; display: flex; gap: 1rem;">
        <li><router-link to="/" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Home</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/user-login" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Login</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/signup" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Sign Up</router-link></li>
        <li v-if="isLoggedIn && isLibrarian"><router-link to="/lib-dashboard" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Librarian Dashboard</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/user-dashboard" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">User Dashboard</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/profile" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Profile</router-link></li>
        <li v-if="isLoggedIn"><a href="#" @click.prevent="logout" style="color: white; text-decoration: none; padding: 0.5rem 1rem; transition: background-color 0.3s;">Logout</a></li>
      </ul>
    </nav>
  `,
  computed: {
    isLoggedIn() {
      return store.state.loggedIn;
    },
    isLibrarian() {
      return store.state.role === "librarian";
    },
  },
  methods: {
    async logout() {
      try {
        const res = await fetch(window.location.origin + "/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${store.state.token}`,
          },
          credentials: "same-origin",
        });

        if (res.ok) {
          store.commit('logout');
          this.$router.push('/user-login'); // Redirect to login page after logout
        } else {
          console.error("Logout request failed with status:", res.status);
        }
      } catch (error) {
        console.error("Error during logout request:", error);
      }
    }
  }
};

export default Navbar;
