import store from "../utils/store.js";

const Navbar = {
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to='/'>Library System</router-link>
      </div>
      <div class="navbar-links">
        <router-link to='/'>Home</router-link>
        <router-link v-if="isLoggedIn" to='/profile'>Profile</router-link>
        <router-link v-if="!isLoggedIn" to='/user-login'>Login</router-link>
        <router-link v-if="!isLoggedIn" to='/signup'>Signup</router-link>
        <a v-if="isLoggedIn" :href="logoutURL">Logout</a>
      </div>
    </nav>
  `,
  computed: {
    isLoggedIn() {
      return store.state.loggedIn;
    }
  },
  data() {
    return {
      logoutURL: window.location.origin + "/logout",
    };
  },
  style: `
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #333;
      color: white;
    }
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .navbar-links {
      display: flex;
      gap: 1rem;
    }
    .navbar-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }
    .navbar-links a:hover {
      background-color: #555;
    }
  `
};

export default Navbar;
