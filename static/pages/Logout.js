import store from "../utils/store.js";

const Logout = {
  template: `
    <div> 
      <h1 v-if="logoutSuccess">Successfully Logged Out</h1>
      <h1 v-else>Logout Unsuccessful</h1>
    </div>
  `,
  data() {
    return {
      logoutSuccess: false,
    };
  },
  async created() {
    console.log("Logout created lifecycle hit!! ");

    try {
      const res = await fetch(window.location.origin + "/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${store.state.token}`, // Add token if needed for auth
        },
        credentials: "same-origin", // Include credentials (cookies) with the request
      });

      if (res.ok) {
        console.log("Logout request successful");

        // Commit the logout mutation
        store.commit('logout');
        
        // Clear any authentication-related data stored in localStorage
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('token');

        // Update the logout success state
        this.logoutSuccess = true;

        // Optionally redirect the user to a different page after logout
        setTimeout(() => {
          this.$router.push('/user-login');
        }, 2000); // Redirect after 2 seconds
      } else {
        console.error("Logout request failed with status:", res.status);
      }
    } catch (error) {
      console.error("Error during logout request:", error);
    }
  },
};

export default Logout;
