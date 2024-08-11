import store from "../utils/store.js";
import router from "../utils/router.js";

const Profile = {
  template: `
    <div :style="profileContainerStyle">
      <div :style="profileContentStyle">
        <h1 :style="profileTitleStyle">Welcome, {{ displayedUsername }}</h1>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label for="current_email">Current Email:</label>
            <input v-model="currentEmail" type="email" id="current_email" class="form-control" disabled />
          </div>
          <div class="form-group">
            <label for="new_email">New Email:</label>
            <input v-model="newEmail" type="email" id="new_email" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="username">Username:</label>
            <input v-model="username" type="text" id="username" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input v-model="password" type="password" id="password" class="form-control" />
          </div>
          <button type="submit" class="btn btn-primary">Update Profile</button>
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      currentEmail: '',
      newEmail: '',
      username: '',
      password: '',
      profileContainerStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
      },
      profileContentStyle: {
        textAlign: 'center',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      },
      profileTitleStyle: {
        marginBottom: '1.5rem',
      },
    };
  },
  computed: {
    displayedUsername() {
      return this.username || (this.currentEmail && this.currentEmail.split('@')[0]) || ''; // Extract the part before @
    }
  },
  methods: {
    async updateProfile() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error('No authentication token found');

        const response = await fetch('/api/update-profile', {
          method: 'POST',
          headers: {
            "Authentication-Token": token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current_email: this.currentEmail,
            new_email: this.newEmail,
            username: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) throw new Error('Failed to update profile');
        const data = await response.json();
        alert('Profile updated successfully! Please log in with your new credentials.');

        // Clear session storage and redirect to login page
        sessionStorage.clear();
        store.commit('setLoggedIn', false);
        router.push('/user-login');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    },
    initializeProfileData() {
      this.currentEmail = sessionStorage.getItem("email") || '';
      this.newEmail = this.currentEmail;
      this.username = sessionStorage.getItem("username") || this.displayedUsername;
      this.password = ''; // Leave password empty for security reasons
    }
  },
  created() {
    if (!store.state.loggedIn) {
      router.push('/user-login');
      return;
    }

    // Initialize profile data
    this.initializeProfileData();
  },
};

export default Profile;
