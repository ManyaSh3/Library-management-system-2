import router from "../utils/router.js";
import store from "../utils/store.js";

const Login = {
  template: `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5dc;">
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
        <div style="background: rgba(255, 255, 255, 0.9); padding: 2rem; border-radius: 8px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); width: 100%; max-width: 400px; text-align: center;">
          <h3 style="font-size: 1.5rem; color: #007bff; margin-bottom: 1.5rem;">Login</h3>
          <form @submit.prevent="submitInfo">
            <div style="margin-bottom: 1rem;">
              <input v-model="email" type="email" style="width: 100%; padding: 0.75rem; border-radius: 5px; border: 1px solid #ced4da;" placeholder="Email" required />
            </div>
            <div style="margin-bottom: 1.5rem;">
              <input v-model="password" type="password" style="width: 100%; padding: 0.75rem; border-radius: 5px; border: 1px solid #ced4da;" placeholder="Password" required />
            </div>
            <button type="submit" style="width: 100%; padding: 0.75rem; border-radius: 5px; border: none; background-color: #007bff; color: white; cursor: pointer; transition: background-color 0.3s;">Submit</button>
          </form>
          <div style="text-align: center; margin-top: 1.5rem;">
            <p>Don't have an account? <router-link to="/signup" style="color: #007bff; text-decoration: none;">Sign Up</router-link></p>
          </div>
          <div style="text-align: center; margin-top: 1.5rem;">
            <p><router-link to="/forgot-password" style="color: #007bff; text-decoration: none;">Forgot Password?</router-link></p>
          </div>
        </div>
      </div>
      <footer style="width: 100%; text-align: center; padding: 1rem 0; background-color: #333; color: white;">
        <p>© 2024 Your Company. All Rights Reserved. | <router-link to="/terms" style="color: white; text-decoration: none;">Terms of Service</router-link> | <router-link to="/privacy" style="color: white; text-decoration: none;">Privacy Policy</router-link></p>
      </footer>
    </div>
  `,
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async submitInfo() {
      if (!this.email || !this.password) {
        alert("Please fill in all fields.");
        return;
      }

      const url = window.location.origin + "/user-login";
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
          credentials: "same-origin",
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);

          // Store the login state and user information in Vuex
          store.commit('setLogin');
          store.commit('setRole', data.role);
          store.commit('setToken', data.token);

          // Store data in sessionStorage
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("role", data.role);
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("userId", data.user_id); 

          // Handle successful login, e.g., redirect
          switch (data.role) {
            case "user":
              router.push("/user-dashboard");
              break;
            case "librarian":
              router.push("/lib-dashboard"); 
              break;
            default:
              alert("Unknown role. Please contact support.");
          }
        } else {
          const errorData = await res.json();
          console.error("Login failed:", errorData);
          alert(errorData.message || "Login failed. Please check your credentials and try again.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert("An error occurred. Please try again later.");
      }
    },
  },
};

export default Login;
