import store from "../utils/store.js";
import router from "../utils/router.js";

const EditBook = {
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #f0f2f5;">
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 80%; max-width: 800px;">
        <h1 style="margin-bottom: 1.5rem;">Edit Book</h1>
        <div style="margin-bottom: 1rem;">
          <input v-model="title" type="text" placeholder="Title" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <input v-model="author" type="text" placeholder="Author" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;" />
        </div>
        <div style="margin-bottom: 1rem;">
          <textarea v-model="content" placeholder="Content" required style="width: 100%; padding: 0.5rem; border-radius: 5px; border: 1px solid #ced4da;"></textarea>
        </div>
        <button @click="updateBook" style="width: 100%; padding: 0.5rem; border: none; border-radius: 5px; background-color: #007bff; color: white; cursor: pointer;">Update Book</button>
      </div>
    </div>
  `,
  data() {
    return {
      title: '',
      author: '',
      content: '',
      bookId: this.$route.params.bookId,
    };
  },
  created() {
    this.checkAuth();
    this.fetchBookDetails();
  },
  methods: {
    checkAuth() {
      if (!store.state.loggedIn) {
        router.push('/user-login'); // Redirect to login if not authenticated
      }
    },
    async fetchBookDetails() {
      try {
        const res = await fetch(`${window.location.origin}/api/edit-book/${this.bookId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          const errorData = await res.text();
          console.error("Fetch book details request failed:", errorData);
          alert(`Failed to fetch book details: ${errorData}`);
          return;
        }

        const bookData = await res.json();
        this.title = bookData.title;
        this.author = bookData.author;
        this.content = bookData.content;
      } catch (error) {
        console.error("Error fetching book details:", error);
        alert('Failed to fetch book details. Please try again later.');
      }
    },
    async updateBook() {
      try {
        const res = await fetch(`${window.location.origin}/api/edit-book/${this.bookId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            title: this.title,
            author: this.author,
            content: this.content,
          }),
        });

        if (res.ok) {
          alert('Book updated successfully');
          router.push(`/lib-dashboard`); // Redirect to the section view page
        } else {
          const errorData = await res.json();
          console.error("Update book request failed:", errorData);
          alert(`Failed to update book: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error during update book request:", error);
        alert('Failed to update book. Please try again later.');
      }
    },
  },
};

export default EditBook;
