import store from '../utils/store.js';
import router from '../utils/router.js';

const RatingsAndReviews = {
  template: `
    <div>
      <h2 class="text-center my-4">Rate and Review</h2>
      <div v-if="book">
        <h3 class="text-center">{{ book.title }} by {{ book.author }}</h3>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label for="rating">Rating:</label>
            <select v-model="rating" id="rating" class="form-control" required>
              <option value="" disabled>Select a rating</option>
              <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="review">Review:</label>
            <textarea v-model="review" id="review" class="form-control" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
      <div v-else class="text-center">Loading book details...</div>
    </div>
  `,
  data() {
    return {
      book: null,
      rating: '',
      review: '',
    };
  },
  methods: {
    async fetchBookDetails(bookId) {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch(`${window.location.origin}/api/rate-and-review/${bookId}`, {
          headers: {
            "Authentication-Token": token,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        this.book = await response.json();
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },
    async submitReview() {
      try {
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");

        if (!token || !userId) {
          throw new Error('User ID or authentication token not found');
        }

        const response = await fetch(`${window.location.origin}/api/review`, {
          method: 'POST',
          headers: {
            "Authentication-Token": token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            bookId: this.book.id,
            rating: this.rating,
            review: this.review,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to submit review');
        }

        const data = await response.json();
        console.log(data);
        alert('Review submitted successfully!');
        this.$router.push('/borrowed_books'); // Redirect back to borrowed books
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again later.');
      }
    },
    checkAuth() {
      if (!store.state.loggedIn) {
        router.push('/user-login'); // Redirect to login if not authenticated
      }
    }
  },
  created() {
    this.checkAuth();
    const bookId = this.$route.params.bookId;
    if (bookId) {
      this.fetchBookDetails(bookId);
    } else {
      console.error('No bookId found in route parameters');
    }
  },
};

export default RatingsAndReviews;
