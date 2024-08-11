import store from "../utils/store.js";
import router from "../utils/router.js";

const DashboardLibrarian = {
  template: `
    <div :style="dashboardContainerStyle">
      <div :style="dashboardContentStyle">
        <h1 :style="dashboardTitleStyle">Librarian Dashboard</h1>
        <p :style="welcomeTextStyle">Welcome Miss Librarian! Manage your library efficiently.</p>
        <div :style="statsContainerStyle">
          <div :style="statCardStyle" @mouseover="hoverStatCard" @mouseout="unhoverStatCard">
            <h3 :style="statTitleStyle">Total Books</h3>
            <p :style="statValueStyle">{{ totalBooks }}</p>
          </div>
          <div :style="statCardStyle" @mouseover="hoverStatCard" @mouseout="unhoverStatCard">
            <h3 :style="statTitleStyle">Total Sections</h3>
            <p :style="statValueStyle">{{ totalSections }}</p>
          </div>
          <div :style="statCardStyle" @mouseover="hoverStatCard" @mouseout="unhoverStatCard">
            <h3 :style="statTitleStyle">Pending Requests</h3>
            <p :style="statValueStyle">{{ pendingRequests }}</p>
          </div>
        </div>
        <div :style="buttonsContainerStyle">
        <div :style="buttonsContainerStyle">
          <router-link :style="[buttonStyle, addButtonStyle]" to="/add-section">
            <i class="fas fa-plus-circle" :style="{ color: '#333' }"></i> Add New Section
          </router-link>
          <router-link :style="[buttonStyle, addButtonStyle]" to="/add-book">
            <i class="fas fa-plus-circle" :style="{ color: '#333' }"></i> Add New Book
          </router-link>
          <router-link :style="[buttonStyle, yellowButtonStyle]" to="/view-requests">
            <i class="fas fa-eye" :style="{ color: '#333' }"></i> View Requests
          </router-link>
          <button @click="fetchIssuedBooks" :style="[buttonStyle, yellowButtonNoBorderStyle]">
            <i class="fas fa-book-open" :style="{ color: '#333' }"></i> View Issued Books
          </button>
          <button @click="toggleRatingsAndReviews" :style="[buttonStyle, yellowButtonNoBorderStyle]">
            <i class="fas fa-star" :style="{ color: '#333' }"></i> View Ratings and Reviews
          </button>
          <router-link :style="[buttonStyle, statsButtonStyle]" to="/librarian-dashboard">
            <i class="fas fa-chart-bar" :style="{ color: '#fff' }"></i> View Stats
          </router-link>
        </div>

        </div>

        <h2 :style="sectionTitleStyle">Sections</h2>
        <table :style="tableStyle">
          <thead :style="tableHeadStyle">
            <tr>
              <th>Section ID</th>
              <th>Section Name</th>
              <th>Number of Books</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="section in sections" :key="section.id">
              <td>{{ section.id }}</td>
              <td>{{ section.title }}</td>
              <td>{{ section.book_count }}</td>
              <td>
                <router-link :style="[actionButtonStyle, viewButtonStyle]" :to="'/view-section/' + section.id">View</router-link>
                <router-link :style="[actionButtonStyle, editButtonStyle]" :to="'/edit-section/' + section.id">Edit</router-link>
                <router-link :style="[actionButtonStyle, deleteButtonStyle]" :to="'/delete-section/' + section.id">Delete</router-link>
                <router-link :style="[actionButtonStyle, addBookButtonStyle]" :to="'/add-book/' + section.id">+ Add Books</router-link>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="issuedBooks.length > 0" :style="issuedBooksContainerStyle" ref="issuedBooksSection">
          <h2 :style="sectionTitleStyle">Issued Books <button @click="closeIssuedBooks" :style="closeButtonStyle">X</button> </h2>
          <table :style="tableStyle">
            <thead :style="tableHeadStyle">
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>User ID</th>
                <th>Date Issued</th>
                <th>Return Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in issuedBooks" :key="book.id">
                <td>{{ book.title }}</td>
                <td>{{ book.author }}</td>
                <td>{{ book.user_id }}</td>
                <td>{{ new Date(book.date_issued).toLocaleDateString() }}</td>
                <td>{{ new Date(book.date_return).toLocaleDateString() }}</td>
                <td><button @click="revokeAccess(book.id)" :style="revokeButtonStyle">Revoke Access</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="showRatingsAndReviews" :style="ratingsContainerStyle"  ref="ratingsSection">
          <h2 :style="sectionTitleStyle">Ratings and Reviews <button @click="closeRatingsAndReviews" :style="closeButtonStyle">X</button> </h2>
          <table :style="tableStyle">
            <thead :style="tableHeadStyle">
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>User ID</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in ratingsAndReviews" :key="review.id">
                <td>{{ review.title }}</td>
                <td>{{ review.author }}</td>
                <td>{{ review.user_id }}</td>
                <td>{{ review.rating }}</td>
                <td>{{ review.review }}</td>
                <td>{{ new Date(review.date_created).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  computed: {
    
    username() {
      const email = store.state.email || '';
      const username = email.split('@')[0]; // Extract the part before @
      return username;
    }
  },
  created() {
    console.log('User logged in:', store.state.loggedIn);
    console.log('User role:', store.state.role);
    // Check if the user is logged in and has the librarian role
    if (!store.state.loggedIn || store.state.role !== 'librarian') {
      router.push('/user-login'); // Redirect to login if not authenticated or not a librarian
    }

    // Fetch dashboard stats
    this.fetchDashboardStats();
    // Fetch sections data
    this.fetchSections();
  },
  data() {
    return {
      totalBooks: 0,
      totalSections: 0,
      pendingRequests: 0,
      sections: [],
      issuedBooks: [],
      ratingsAndReviews: [],
      showRatingsAndReviews: false,
      dashboardContainerStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '20px',
      },
      dashboardContentStyle: {
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        width: '80%',
        maxWidth: '800px',
      },
      dashboardTitleStyle: {
        marginBottom: '1.5rem',
        fontSize: '2.5rem',
        color: '#333',
        fontWeight: 'bold',
      },
      welcomeTextStyle: {
        marginBottom: '1.5rem',
        fontSize: '1.2rem',
        color: '#555',
      },
      statsContainerStyle: {
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '2rem',
      },
      
      statsButtonStyle: {
        backgroundColor: '#a6c9e2', // Change to pastel light blue if needed
        color: '#333',
      },
      
      statCardStyle: {
        backgroundColor: '#f1f1f1',
        padding: '1rem',
        borderRadius: '8px',
        width: '30%',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
      },
      statCardStyleHover: {
        transform: 'scale(1.05)',
        backgroundColor: '#e9e9e9',
      },
      statTitleStyle: {
        fontSize: '1.2rem',
        color: '#555',
        marginBottom: '0.5rem',
      },
      statValueStyle: {
        fontSize: '1.5rem',
        color: '#333',
        fontWeight: 'bold',
      },
      buttonsContainerStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5rem',
      },
      buttonStyle: {
        display: 'inline-block',
        margin: '0.5rem 0',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '1rem',
        color: '#333', // Darker color for text to ensure readability
        backgroundColor: '#a6c9e2', // Pastel light blue
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, transform 0.3s',
      },
      addButtonStyle: {
        backgroundColor: '#a6c9e2', // Also set pastel light blue here
      },
      yellowButtonStyle: {
        backgroundColor: '#a6c9e2', // Also set pastel light blue here
      },
      yellowButtonNoBorderStyle: {
        backgroundColor: '#a6c9e2', // Also set pastel light blue here
        border: 'none',
      },
      sectionTitleStyle: {
        marginTop: '2rem',
        fontSize: '1.8rem',
        color: '#333',
        fontWeight: 'bold',
      },
      tableStyle: {
        width: '100%',
        marginTop: '1.5rem',
        borderCollapse: 'collapse',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      tableHeadStyle: {
        backgroundColor: '#333',
        color: 'white',
      },
      tableRowStyle: {
        backgroundColor: '#f9f9f9',
      },
      tableRowHoverStyle: {
        backgroundColor: '#e9e9e9',
      },
      actionButtonStyle: {
        margin: '0 0.5rem',
        padding: '0.2rem 0.5rem',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '0.9rem',
        color: 'white',
        transition: 'background-color 0.3s, transform 0.3s',
      },
      viewButtonStyle: {
        backgroundColor: '#17a2b8',
      },
      editButtonStyle: {
        backgroundColor: '#ffc107',
      },
      deleteButtonStyle: {
        backgroundColor: '#dc3545',
      },
      addBookButtonStyle: {
        backgroundColor: '#6c757d',
      },
      revokeButtonStyle: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s',
      },
      issuedBooksContainerStyle: {
        marginTop: '2rem',
        width: '100%',
      },
      ratingsContainerStyle: {
        marginTop: '2rem',
        width: '100%',
      },
      closeButtonStyle: {
        background: 'transparent',
        border: 'none',
        color: '#dc3545',
        fontSize: '1.5rem',
        cursor: 'pointer',
        float: 'right',
      },
    };
  },
  methods: {
    closeIssuedBooks() {
      this.issuedBooks = [];  // This will hide the issued books section
    },
  
    closeRatingsAndReviews() {
      this.showRatingsAndReviews = false;  // This will hide the ratings and reviews section
    },
    async fetchDashboardStats() {
      try {
        // Fetch total books
        const booksResponse = await fetch('/api/books/count', {
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });
        const booksData = await booksResponse.json();
        this.totalBooks = booksData.count;

        // Fetch total sections
        const sectionsResponse = await fetch('/api/sections/count', {
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });
        const sectionsData = await sectionsResponse.json();
        this.totalSections = sectionsData.count;

        // Fetch pending requests
        const requestsResponse = await fetch('/api/requests/pending/count', {
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });
        const requestsData = await requestsResponse.json();
        this.pendingRequests = requestsData.count;

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    },
    async fetchSections() {
      try {
        const response = await fetch('/api/sections', {
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);  // Debugging line
          throw new Error(errorText || 'Failed to fetch sections');
        }
        const sectionsData = await response.json();

        // Fetch book count for each section
        const sectionsWithBookCount = await Promise.all(sectionsData.map(async section => {
          const booksResponse = await fetch(`/api/sections/${section.id}/books`, {
            headers: {
              "Authentication-Token": sessionStorage.getItem("token"),
            },
          });
          const books = await booksResponse.json();
          section.book_count = books.length;
          return section;
        }));

        this.sections = sectionsWithBookCount;

      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    },
    async fetchIssuedBooks() {
      try {
        const response = await fetch('/api/issued-books', {
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });
        if (!response.ok) throw new Error('Failed to fetch issued books');
        const issuedBooksData = await response.json();
        this.issuedBooks = issuedBooksData;
         // Scroll to the issued books section
        this.$nextTick(() => {
          this.$refs.issuedBooksSection.scrollIntoView({ behavior: 'smooth' });
        });
      } catch (error) {
        console.error('Error fetching issued books:', error);
      }
    },
    async revokeAccess(bookId) {
      try {
        const response = await fetch(`/api/revoke-access/${bookId}`, {
          method: 'DELETE',
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });
        if (!response.ok) throw new Error('Failed to revoke access');
        const data = await response.json();
        console.log(data);
        // Update the issued books list
        this.fetchIssuedBooks();
      } catch (error) {
        console.error('Error revoking access:', error);
        alert('Failed to revoke access. Please try again.');
      }
    },
    async fetchRatingsAndReviews() {
      try {
        const response = await fetch('/api/ratings-and-reviews', {
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
          },
        });
        if (!response.ok) throw new Error('Failed to fetch ratings and reviews');
        const ratingsAndReviewsData = await response.json();
        this.ratingsAndReviews = ratingsAndReviewsData;
      } catch (error) {
        console.error('Error fetching ratings and reviews:', error);
      }
    },
    toggleRatingsAndReviews() {
      this.showRatingsAndReviews = !this.showRatingsAndReviews;
      if (this.showRatingsAndReviews) {
        this.fetchRatingsAndReviews();
        // Scroll to the ratings and reviews section
        this.$nextTick(() => {
          this.$refs.ratingsSection.scrollIntoView({ behavior: 'smooth' });
        });
      }
    },
    hoverStatCard(event) {
      event.currentTarget.style.transform = 'scale(1.05)';
      event.currentTarget.style.backgroundColor = '#e9e9e9';
    },
    unhoverStatCard(event) {
      event.currentTarget.style.transform = 'scale(1)';
      event.currentTarget.style.backgroundColor = '#f1f1f1';
    },
  },
};

export default DashboardLibrarian;
