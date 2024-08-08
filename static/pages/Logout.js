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
        },
        credentials: "same-origin", // Include credentials (cookies) with the request
      });

      if (res.ok) {
        this.logoutSuccess = true;
        store.commit('setlogout'); // Commit the logout mutation to update the Vuex store
      } else {
        console.error("Logout request failed:", res.statusText);
      }
    } catch (error) {
      console.error("Error during logout request:", error);
    }
  },
};

export default Logout;