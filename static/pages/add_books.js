import store from "../utils/store.js";
import router from "../utils/router.js";

const AddBook = {
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5;">
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 80%; max-width: 800px;">
        <h1 style="margin-bottom: 1.5rem;">Add New Book</h1>
        <div style="margin-bottom: 1rem;">
          <select v-model="selectedSection" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;">
            <option disabled value="">Select a section</option>
            <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.title }}</option>
          </select>
        </div>
        <div style="margin-bottom: 1rem;">
          <input v-model="title" type="text" placeholder="Title" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <input v-model="author" type="text" placeholder="Author" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <textarea v-model="content" placeholder="Content" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;"></textarea>
        </div>
        <button @click="submitBook" style="width: 100%; padding: 0.5rem; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer;">Add Book</button>
      </div>
    </div>
  `,
  data() {
    return {
      sections: [],
      selectedSection: this.$route.params.sectionId || '',
      title: '',
      author: '',
      content: '',
    };
  },
  created() {
    this.checkAuth();
    this.fetchSections();
  },
  methods: {
    checkAuth() {
      if (!store.state.loggedIn) {
        router.push('/user-login'); // Redirect to login if not authenticated
      }
    },
    async fetchSections() {
      try {
        const res = await fetch(`${window.location.origin}/api/sections`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });
        if (res.ok) {
          this.sections = await res.json();
          if (this.selectedSection) {
            const sectionExists = this.sections.some(section => section.id === parseInt(this.selectedSection));
            if (!sectionExists) {
              alert('Invalid section ID in URL');
              this.selectedSection = '';
            }
          }
        } else {
          const errorData = await res.json();
          console.error("Fetch sections request failed:", errorData);
          alert('Failed to fetch sections');
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        alert('Failed to fetch sections');
      }
    },
    async submitBook() {
      if (!this.selectedSection) {
        alert('Please select a section');
        return;
      }

      try {
        const res = await fetch(`${window.location.origin}/api/sections/${this.selectedSection}/books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            title: this.title,
            author: this.author,
            content: this.content,
            date_created: new Date().toISOString(),
          }),
          credentials: "same-origin",
        });

        if (res.ok) {
          alert('Book added successfully');
          router.push("/lib-dashboard"); // Redirect to the librarian dashboard
        } else {
          const errorData = await res.json();
          console.error("Add book request failed:", errorData);
          alert(`Failed to add book: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error during add book request:", error);
        alert('Failed to add book. Please try again later.');
      }
    },
  },
};

export default AddBook;
