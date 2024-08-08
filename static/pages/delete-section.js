import store from "../utils/store.js";
import router from "../utils/router.js";

const DeleteSection = {
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5;">
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 80%; max-width: 800px;">
        <h1 style="margin-bottom: 1.5rem;">Delete Section</h1>
        <p>Are you sure you want to delete this section?</p>
        <p><strong>{{ sectionTitle }}</strong></p>
        <div style="display: flex; justify-content: center; gap: 1rem;">
          <button @click="confirmDelete" style="padding: 0.5rem 1rem; border: none; border-radius: 5px; background-color: #dc3545; color: white; cursor: pointer;">Delete</button>
          <router-link to="/lib-dashboard" style="padding: 0.5rem 1rem; border-radius: 5px; background-color: #007bff; color: white; text-decoration: none;">Cancel</router-link>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      sectionTitle: '',
      sectionId: this.$route.params.sectionId,
    };
  },
  created() {
    this.checkAuth();
    this.fetchSectionDetails();
  },
  methods: {
    checkAuth() {
      if (!store.state.loggedIn) {
        router.push('/user-login'); // Redirect to login if not authenticated
      }
    },
    async fetchSectionDetails() {
      try {
        const res = await fetch(`${window.location.origin}/api/edit-section/${this.sectionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          const errorData = await res.text();
          console.error("Fetch section details request failed:", errorData);
          alert(`Failed to fetch section details: ${errorData}`);
          return;
        }

        const sectionData = await res.json();
        this.sectionTitle = sectionData.title;
      } catch (error) {
        console.error("Error fetching section details:", error);
        alert('Failed to fetch section details. Please try again later.');
      }
    },
    async confirmDelete() {
      try {
        const res = await fetch(`${window.location.origin}/api/delete-section/${this.sectionId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });

        if (res.ok) {
          alert('Section deleted successfully');
          router.push("/lib-dashboard"); // Redirect to the librarian dashboard
        } else {
          const errorData = await res.json();
          console.error("Delete section request failed:", errorData);
          alert(`Failed to delete section: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error during delete section request:", error);
        alert('Failed to delete section. Please try again later.');
      }
    },
  },
};

export default DeleteSection;
