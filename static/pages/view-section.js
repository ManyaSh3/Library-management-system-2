import store from "../utils/store.js";
import router from "../utils/router.js";

const ViewSection = {
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #f0f2f5;">
      <div style="text-align: center; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 80%; max-width: 800px;">
        <h1 style="margin-bottom: 1.5rem;">Books in Section {{ sectionId }}</h1>
        <div v-if="books.length === 0" style="margin-top: 1.5rem; margin-bottom: 1.5rem">No books found for this section.</div>
        <ul v-else style="list-style: none; padding: 0;">
          <li v-for="book in books" :key="book.id" style="margin-bottom: 1rem; border-bottom: 1px solid #ddd; padding-bottom: 1rem;">
            <h3>{{ book.title }}</h3>
            <p><strong>Author:</strong> {{ book.author }}</p>
            <p><strong>Content:</strong> {{ book.content }}</p>
            <div>
              <button @click="editBook(book.id)" style="margin-right: 1rem; padding: 0.5rem 1rem; border-radius: 5px; background-color: #ffc107; color: white; border: none; cursor: pointer;">Edit</button>
              <button @click="deleteBook(book.id)" style="padding: 0.5rem 1rem; border-radius: 5px; background-color: #dc3545; color: white; border: none; cursor: pointer;">Delete</button>
            </div>
          </li>
        </ul>
        <router-link to="/lib-dashboard" style="margin-top: 1.5rem; padding: 0.5rem 1rem; border-radius: 5px; background-color: #007bff; color: white; text-decoration: none;">Back to Dashboard</router-link>
      </div>
    </div>
  `,
  data() {
    return {
      books: [],
      sectionId: this.$route.params.sectionId,
    };
  },
  created() {
    this.checkAuth();
    this.fetchBooks();
  },
  methods: {
    checkAuth() {
      if (!store.state.loggedIn) {
        router.push('/user-login'); // Redirect to login if not authenticated
      }
    },
    async fetchBooks() {
      try {
        const res = await fetch(`${window.location.origin}/api/view-section/${this.sectionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          const errorData = await res.text();
          console.error("Fetch books request failed:", errorData);
          // alert(`Failed to fetch books: ${errorData}`);
          return;
        }

        this.books = await res.json();
      } catch (error) {
        console.error("Error fetching books:", error);
        // alert('Failed to fetch books. Please try again later.');
      }
    },
    editBook(bookId) {
      router.push(`/edit-book/${bookId}`);
    },
    async deleteBook(bookId) {
      if (!confirm("Are you sure you want to delete this book?")) {
        return;
      }
      try {
        const res = await fetch(`${window.location.origin}/api/delete-book/${bookId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });

        if (!res.ok) {
          const errorData = await res.text();
          console.error("Delete book request failed:", errorData);
          alert(`Failed to delete book: ${errorData}`);
          return;
        }

        alert('Book deleted successfully');
        window.location.reload(); // Refresh the page
        this.fetchBooks(); // Refresh the list of books
      } catch (error) {
        console.error("Error deleting book:", error);
        alert('Failed to delete book. Please try again later.');
      }
    },
  },
};

export default ViewSection;
