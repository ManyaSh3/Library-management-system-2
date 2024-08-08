import store from "../utils/store.js";
import router from "../utils/router.js";

const EditSection = {
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5;">
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 80%; max-width: 800px;">
        <h1 style="margin-bottom: 1.5rem;">Edit Section</h1>
        <div style="margin-bottom: 1rem;">
          <input v-model="title" type="text" placeholder="Title" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <textarea v-model="description" placeholder="Description" style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;"></textarea>
        </div>
        <button @click="updateSection" style="width: 100%; padding: 0.5rem; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer;">Update Section</button>
      </div>
    </div>
  `,
  data() {
    return {
      title: '',
      description: '',
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
      const sectionId = this.$route.params.sectionId;
      console.log('Section ID:', sectionId); // Debugging line
      if (!sectionId) {
        console.error('Section ID is undefined');
        alert('Section ID is missing. Please try again.');
        return;
      }

      try {
        const res = await fetch(`${window.location.origin}/api/edit-section/${sectionId}`, {
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
        console.log('Fetched section data:', sectionData); // Debugging line
        this.title = sectionData.title;
        this.description = sectionData.description;

      } catch (error) {
        console.error("Error fetching section details:", error);
        alert('Failed to fetch section details. Please try again later.');
      }
    },
    async updateSection() {
      const sectionId = this.$route.params.sectionId;
      try {
        const res = await fetch(`${window.location.origin}/api/edit-section/${sectionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            title: this.title,
            description: this.description,
          }),
          credentials: "same-origin",
        });

        if (res.ok) {
          alert('Section updated successfully');
          router.push("/lib-dashboard"); // Redirect to the librarian dashboard
        } else {
          const errorData = await res.json();
          console.error("Update section request failed:", errorData);
          alert(`Failed to update section: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error during update section request:", error);
        alert('Failed to update section. Please try again later.');
      }
    },
  },
};

export default EditSection;
