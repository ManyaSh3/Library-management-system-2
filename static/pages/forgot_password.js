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
        <div v-if="emailSent" style="margin-top: 1rem; padding: 1rem; border: 1px solid #ced4da; border-radius: 5px; background-color: #e6ffe6;">
          <p>A password reset link has been sent to your email.</p>
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
      emailSent: false,
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
        this.emailSent = true;
      } else {
        const errorData = await res.json();
        console.error("Email submission failed:", errorData);
        alert("Email submission failed. Please check your email and try again.");
      }
    },
  },
};

export default ForgotPassword;
