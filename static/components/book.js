const Book = {
  template: `
    <div class="book-card-container" style="max-width: 300px; margin: 10px;">
      <div class="card shadow-sm p-4 mb-4 book-card" @click="openPopup" style="border-radius: 15px; transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; background-color: #fff3e0;">
        <img :src="randomImageUrl" class="card-img-top" alt="Book Image" style="height: 300px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title text-primary">{{ title }}</h5>
          <p class="card-text text-secondary">{{ author }}</p>
        </div>
        <div class="card-footer text-muted">
          <small>{{ description }}</small>
        </div>
        <button class="btn btn-primary mt-3" @click.stop="openPopup" style="background-color: #ff6f61; border: none;">Request Book</button>
      </div>
      <div v-if="showPopup" class="popup-overlay d-flex align-items-center justify-content-center" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000;">
        <div class="popup-content card shadow p-4" style="max-width: 500px; width: 100%; background: #ffffff; border-radius: 8px; padding: 20px; text-align: center;">
          <h5 class="card-title text-primary">{{ title }}</h5>
          <p class="card-text text-secondary">{{ author }}</p>
          <div class="text-muted text-end mt-3">
            <small>{{ description }}</small>
          </div>
          <form @submit.prevent="requestBook">
            <div class="form-group">
              <label for="days">Number of Days (1-7):</label>
              <input type="number" v-model="days" class="form-control" min="1" max="7" required />
            </div>
            <button type="submit" class="btn btn-primary mt-3" style="background-color: #ff6f61; border: none;">Request Book</button>
          </form>
          <button class="btn btn-secondary mt-3" @click="closePopup" style="background-color: #b0bec5; border: none;">Close</button>
        </div>
      </div>
    </div>
  `,
  props: {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showPopup: false,
      days: 1,
      randomImageUrl: `https://picsum.photos/300/400?random=${Math.floor(Math.random() * 1000)}`, // Random image URL
    };
  },
  methods: {
    openPopup() {
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    async requestBook() {
      try {
        console.log('Requesting book with id:', this.id);
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          throw new Error('User ID is missing from session storage');
        }

        const response = await fetch('/api/request-book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authentication-Token": sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            book_id: this.id,
            user_id: userId,
            days: this.days,
          }),
        });

        const responseData = await response.json();
        console.log('Response from backend:', responseData);

        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to request book');
        }

        alert('Book requested successfully!');
        this.closePopup();
      } catch (error) {
        console.error('Error requesting book:', error);
        alert('Failed to request book. Error: ' + error.message);
      }
    },
  },
};

export default Book;
