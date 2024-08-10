import store from '../utils/store.js';
import router from '../utils/router.js';

const BorrowedBooks = {
  template: `
    <div>
      <h2 class="text-center my-4">Borrowed Books</h2>
      <div v-if="borrowedBooks.length === 0" class="text-center">
        No borrowed books found.
      </div>
      <div v-for="book in borrowedBooks" :key="book.id" class="card mb-3 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">{{ book.title }} by {{ book.author }}</h5>
          <p class="card-text">Issued on: {{ new Date(book.date_issued).toLocaleDateString() }}</p>
          <p class="card-text">Return by: {{ new Date(book.date_return).toLocaleDateString() }}</p>
          <p class="card-text">Status: {{ book.status ? 'Active' : 'Returned' }}</p>
          <button @click="returnBook(book.book_id)" class="btn btn-primary">Return Book</button>
          <button @click="goToRatingsAndReviews(book.book_id)" class="btn btn-secondary">Provide Rating & Review</button>
          <button @click="readBook(book.book_id)" class="btn btn-success">Read Book</button>
          <button @click="downloadBook(book.book_id)" class="btn btn-info">Download Book</button>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      borrowedBooks: [],
    };
  },
  methods: {
    async fetchBorrowedBooks() {
      try {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");

        if (!token || !userId) {
          throw new Error('User ID or authentication token not found');
        }

        const response = await fetch(`${window.location.origin}/api/borrowed-books/${userId}`, {
          headers: {
            "Authentication-Token": token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to fetch borrowed books');
        }

        this.borrowedBooks = await response.json();
        console.log('Borrowed books fetched:', this.borrowedBooks);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    },
    async returnBook(bookId) {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`${window.location.origin}/api/return-book/${bookId}`, {
          method: 'POST',
          headers: {
            "Authentication-Token": token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to return book');
        }

        const data = await response.json();
        console.log(data);
        alert('Book returned successfully!');
        this.fetchBorrowedBooks(); // Refresh the list of borrowed books
      } catch (error) {
        console.error('Error returning book:', error);
        alert('Failed to return book. Please try again later.');
      }
    },
    goToRatingsAndReviews(bookId) {
      router.push(`/rate-and-review/${bookId}`);
    },
    readBook(bookId) {
      // Redirect to the external site for reading the book
      window.open(`https://chapmanganelo.com/manga-ek118878/chapter-1`, '_blank');
    },
    downloadBook(bookId) {
      // Redirect to the download book page
      router.push(`/download-book/${bookId}`);
    },
    checkAuth() {
      if (!store.state.loggedIn) {
        router.push('/user-login'); // Redirect to login if not authenticated
      }
    }
  },
  created() {
    this.checkAuth();
    this.fetchBorrowedBooks();
  },
};

export default BorrowedBooks;
