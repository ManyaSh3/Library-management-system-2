import store from "../utils/store.js";
import router from "../utils/router.js";

const AddSection = {
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5;">
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 80%; max-width: 800px;">
        <h1 style="margin-bottom: 1.5rem;">Add New Section</h1>
        <div style="margin-bottom: 1rem;">
          <input v-model="title" type="text" placeholder="Title" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <input v-model="description" type="text" placeholder="Description" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <button @click="submitSection" style="width: 100%; padding: 0.5rem; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer;">Add Section</button>
      </div>
    </div>
  `,
  data() {
    return {
      title: '',
      description: '',
    };
  },
  methods: {
    async submitSection() {
      try {
        const res = await fetch(window.location.origin + "/add-section", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"), // Assuming you use token-based authentication
          },
          body: JSON.stringify({
            title: this.title,
            description: this.description,
          }),
          credentials: "same-origin", // Include credentials (cookies) with the request
        });

        if (res.ok) {
          alert('Section added successfully');
          router.push("/lib-dashboard"); // Redirect to the librarian dashboard
        } else {
          const errorData = await res.json();
          console.error("Add section request failed:", errorData);
          alert('Failed to add section');
        }
      } catch (error) {
        console.error("Error during add section request:", error);
        alert('Failed to add section');
      }
    },
  },
};

export default AddSection;
