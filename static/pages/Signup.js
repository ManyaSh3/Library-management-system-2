import router from "../utils/router.js";

const Signup = {
  template: `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 87vh; background-color: #f5f5f5;">
      <div style="max-width: 400px; width: 100%; padding: 2rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; background-color: white;">
        <h3 style="text-align: center; margin-bottom: 1.5rem;">Sign Up</h3>
        <div style="margin-bottom: 1rem;">
          <input v-model="email" type="email" placeholder="Email" required style="width: 100%; padding: 0.75rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <div style="margin-bottom: 1.5rem;">
          <input v-model="password" type="password" placeholder="Password" required style="width: 100%; padding: 0.75rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <div style="margin-bottom: 1.5rem;">
          <select v-model="role" required style="width: 100%; padding: 0.75rem; border-radius: 5px; border: 1px solid #ced4da;">
            <option value="" disabled>Select Role</option>
            <option value="user">User</option>
          </select>
        </div>
        <button @click="submitInfo" style="width: 100%; padding: 0.75rem; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer;">Submit</button>
        <p style="text-align:center; margin-top: 1rem">Already have an account? <router-link to="/user-login" style="color: #007bff;">Login</router-link></p>

      </div>
      
    </div>
  `,
  data() {
    return {
      email: "",
      password: "",
      role: "",
    };
  },
  methods: {
    async submitInfo() {
      const origin = window.location.origin;
      const url = `${origin}/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          role: this.role,
        }),
        credentials: "same-origin",
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        // Handle successful sign up, e.g., redirect or store token
        router.push("/user-login");
      } else {
        const errorData = await res.json();
        console.error("Sign up failed:", errorData);
        // Handle sign up error
        alert("Sign up failed. Please check your details and try again.");
      }
    },
  },
};

export default Signup;
