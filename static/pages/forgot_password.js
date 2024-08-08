import router from "../utils/router.js";

const ForgotPassword = {
  template: `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5dc;">
      <div style="max-width: 400px; width: 100%; padding: 2rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; background-color: white;">
        <h3 style="text-align: center; margin-bottom: 1.5rem;">Forgot Password</h3>
        <p style="text-align: center; margin-bottom: 1.5rem;">Enter your email to reset your password.</p>
        <form @submit.prevent="submitEmail" style="margin-bottom: 1rem;">
          <input v-model="email" type="email" placeholder="Email" required style="width: 100%; padding: 0.75rem; border-radius: 5px; border: 1px solid #ced4da;" />
          <button type="submit" style="width: 100%; padding: 0.75rem; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer;">Submit</button>
        </form>
        <div v-if="resetUrl" style="margin-top: 1rem; padding: 1rem; border: 1px solid #ced4da; border-radius: 5px; background-color: #fff3e0;">
          <p>Password reset URL: <a :href="resetUrl" target="_blank">{{ resetUrl }}</a></p>
          <p>Reset Token: {{ token }}</p>
        </div>
      </div>
      <footer style="position: fixed; bottom: 0; width: 100%; text-align: center; padding: 1rem 0; background-color: #f5f5dc; color: #6c757d;">
        <p>Remember your password? <router-link to="/login" style="color: #007bff;">Login</router-link></p>
      </footer>
    </div>
  `,
  data() {
    return {
      email: "",
      resetUrl: null,
      token: null,
    };
  },
  methods: {
    async submitEmail() {
      const origin = window.location.origin;
      const url = `${origin}/api/forgot-password`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.email }),
        credentials: "same-origin",
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        this.resetUrl = data.reset_url;
        this.token = data.token;
        alert("A password reset token has been generated. Check the console or below.");
      } else {
        const errorData = await res.json();
        console.error("Email submission failed:", errorData);
        alert("Email submission failed. Please check your email and try again.");
      }
    },
  },
};

export default ForgotPassword;
