import router from "../utils/router.js";

const ResetPassword = {
  template: `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5dc;">
      <div style="max-width: 400px; width: 100%; padding: 2rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; background-color: white;">
        <h3 style="text-align: center; margin-bottom: 1.5rem;">Reset Password</h3>
        <div style="margin-bottom: 1rem;">
          <input v-model="password" type="password" placeholder="New Password" required style="width: 100%; padding: 0.75rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <button @click="submitInfo" style="width: 100%; padding: 0.75rem; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer;">Reset Password</button>
      </div>
    </div>
  `,
  data() {
    return {
      password: "",
      token: this.$route.query.token,
    };
  },
  methods: {
    async submitInfo() {
      const origin = window.location.origin;
      const url = `${origin}/api/reset-password`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: this.token,
          new_password: this.password,
        }),
        credentials: "same-origin",
      });

      if (res.ok) {
        alert('Password reset successfully. Please login with your new password.');
        router.push("/user-login");
      } else {
        const errorData = await res.json();
        console.error("Reset password failed:", errorData);
        alert("Reset password failed. Please check the token and try again.");
      }
    },
  },
};

export default ResetPassword;
