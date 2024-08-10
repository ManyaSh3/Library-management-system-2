import store from '../utils/store.js';
import router from '../utils/router.js';

const DownloadBookPage = {
  template: `
    <div class="container">
      <h2 class="text-center my-4">Download Book</h2>
      <div v-if="loading" class="text-center">Loading book details...</div>
      <div v-if="!loading && bookDetails" class="card mb-3 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">{{ bookDetails.title }} by {{ bookDetails.author }}</h5>
          <p class="card-text">{{ bookDetails.content }}</p>
          <div v-if="!paid" class="text-center">
            <p>To download the book, please proceed with the payment.</p>
            <form @submit.prevent="makePayment" class="payment-form mx-auto" style="max-width: 400px;">
              <div class="mb-4">
                <label for="cardNumber" class="form-label">Card Number</label>
                <input type="text" id="cardNumber" class="form-control form-control-lg" placeholder="1234 5678 9012 3456" required>
              </div>
              <div class="row">
                <div class="col-md-6 mb-4">
                  <label for="expiryDate" class="form-label">Expiry Date</label>
                  <input type="text" id="expiryDate" class="form-control form-control-lg" placeholder="MM/YY" required>
                </div>
                <div class="col-md-6 mb-4">
                  <label for="cvv" class="form-label">CVV</label>
                  <input type="text" id="cvv" class="form-control form-control-lg" placeholder="123" required>
                </div>
              </div>
              <div class="mb-4">
                <label for="cardName" class="form-label">Name on Card</label>
                <input type="text" id="cardName" class="form-control form-control-lg" placeholder="John Doe" required>
              </div>
              <button type="submit" class="btn btn-primary btn-lg w-100">Pay $9.99</button>
            </form>
          </div>
          <div v-if="paid" class="text-center mt-4">
            <p>Payment successful! Click the button below to download your book.</p>
            <button @click="downloadBook" class="btn btn-success btn-lg">Download Book</button>
          </div>
        </div>
      </div>
      <div v-if="errorMessage" class="alert alert-danger text-center">
        {{ errorMessage }}
      </div>
    </div>
  `,
  data() {
    return {
      loading: true,
      bookDetails: null,
      paid: false,
      errorMessage: '',
    };
  },
  methods: {
    async fetchBookDetails(bookId) {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`${window.location.origin}/api/rate-and-review/${bookId}`, {
          headers: {
            "Authentication-Token": token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(errorText || 'Failed to fetch book details');
        }

        this.bookDetails = await response.json();
        console.log('Book details fetched:', this.bookDetails);
      } catch (error) {
        console.error('Error fetching book details:', error);
        this.errorMessage = 'Failed to load book details. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    makePayment() {
      // Simulate payment process
      setTimeout(() => {
        this.paid = true;
        alert('Payment successful!');
      }, 1000);
    },
    downloadBook() {
      // Simulate book download
      alert(`Downloading book: ${this.bookDetails.title}`);
      window.open(`https://drive.usercontent.google.com/u/0/uc?id=0B95YmvPPuCydY29yeUVCOW5hems&export=download`, '_blank');
      
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
    this.fetchBookDetails(bookId);
  },
};

export default DownloadBookPage;
