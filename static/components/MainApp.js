import LibrarySection from './section.js';

const MainApp = {
  template: `
    <div class="container-fluid mt-3">
      <div class="row">
        <div class="col-md-12">
          <form @submit.prevent="searchBooks">
            <div class="input-group">
              <!-- Dropdown for sections -->
              <select v-model="selectedSection" class="form-select">
                <option value="" disabled selected>Select Section</option>
                <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.title }}</option>
              </select>
              <!-- Input for book title -->
              <input 
                type="text" 
                v-model="searchTitle" 
                class="form-control" 
                placeholder="Book Title"
              />
              <!-- Input for book author -->
              <input
                type="text"
                v-model="searchAuthor"
                class="form-control"
                placeholder="Book Author"
              />
              <!-- Search and Clear buttons -->
              <button class="btn btn-outline-danger" @click="clearSearch">
                <i class="fas fa-backspace"></i>
                Clear
              </button>
              <button class="btn btn-outline-primary" type="submit">
                <i class="fa fa-search"></i>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Recently Added Books Section -->
      <div class="section-container" style="margin-bottom: 30px;">
        <h2 @click="toggleSection('recentlyAddedVisible')" class="section-title" :style="headingStyle">
          Recently Added Book
          <span v-if="recentlyAddedVisible" class="toggle-icon" :style="toggleIconStyle">-</span>
          <span v-else class="toggle-icon" :style="toggleIconStyle">+</span>
        </h2>
        <div v-if="recentlyAddedVisible" class="books-container" style="display: flex; flex-wrap: wrap; justify-content: center;">
          <div v-for="book in recentlyAddedBooks" :key="book.id" class="book-card-container" style="flex: 1 1 calc(33.333% - 20px); max-width: calc(33.333% - 20px); margin: 10px;">
            <Book
              :id="book.id"
              :title="book.title"
              :author="book.author"
              :description="book.content"
            />
          </div>
        </div>
      </div>

      <!-- Highly Rated Books Section -->
      <div class="section-container" style="margin-bottom: 30px;">
        <h2 @click="toggleSection('highlyRatedVisible')" class="section-title" :style="headingStyle">
          Highly Rated Books
          <span v-if="highlyRatedVisible" class="toggle-icon" :style="toggleIconStyle">-</span>
          <span v-else class="toggle-icon" :style="toggleIconStyle">+</span>
        </h2>
        <div v-if="highlyRatedVisible" class="books-container" style="display: flex; flex-wrap: wrap; justify-content: center;">
          <div v-for="book in highlyRatedBooks" :key="book.id" class="book-card-container" style="flex: 1 1 calc(33.333% - 20px); max-width: calc(33.333% - 20px); margin: 10px;">
            <Book
              :id="book.id"
              :title="book.title"
              :author="book.author"
              :description="book.content"
            />
          </div>
        </div>
      </div>


      <div v-for="section in filteredSectionsWithBooks" :key="section.id" class="section-container" style="margin-bottom: 30px;">
        <h2 class="section-title" style="margin-bottom: 20px; text-align: center;">{{ section.title }}</h2>
        <div class="books-container" style="display: flex; flex-wrap: wrap; justify-content: center;">
          <div v-for="book in section.books" :key="book.id" class="book-card-container" style="flex: 1 1 calc(33.333% - 20px); max-width: calc(33.333% - 20px); margin: 10px;">
            <Book
              :id="book.id"
              :title="book.title"
              :author="book.author"
              :description="book.content"
            />
          </div>
        </div>
      </div>
    </div>
  `,
  components: {
    Book: LibrarySection.components.Book,
  },
  data() {
    return {
      sections: [],
      selectedSection: '',
      searchTitle: '',
      searchAuthor: '',
      sectionsWithBooks: [],
      recentlyAddedBooks: [],
      highlyRatedBooks: [],
      recentlyAddedVisible: false, // Visibility toggle for recently added books
      highlyRatedVisible: false, // Visibility toggle for highly rated books
      headingStyle: {
        cursor: 'pointer',
        textAlign: 'center',
        fontSize: '1.8rem',
        color: '#333',
        backgroundColor: '#F7F7F7',
        padding: '10px 20px',
        borderRadius: '8px',
        marginTop: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s, box-shadow 0.3s',
      },
      toggleIconStyle: {
        marginLeft: '10px',
        fontSize: '1.2rem',
        color: '#555',
        verticalAlign: 'middle',
      },
    };
  },
  computed: {
    filteredSectionsWithBooks() {
      if (!this.selectedSection && !this.searchTitle && !this.searchAuthor) {
        return this.sectionsWithBooks;
      }
      return this.sectionsWithBooks.map(section => {
        if (this.selectedSection && section.id !== this.selectedSection) {
          return null;
        }
        const filteredBooks = section.books.filter(book => 
          book.title.toLowerCase().includes(this.searchTitle.toLowerCase())
          && book.author.toLowerCase().includes(this.searchAuthor.toLowerCase())
        );
        if (filteredBooks.length > 0) {
          return { ...section, books: filteredBooks };
        }
        return null;
      }).filter(section => section);
    }
  },
  created() {
    this.fetchSectionsWithBooks();
  },
  methods: {
    async fetchSectionsWithBooks() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        const sectionsResponse = await fetch('/api/sections', {
          headers: {
            "Authentication-Token": token,
            'Content-Type': 'application/json',
          },
        });

        if (!sectionsResponse.ok) {
          const errorResponse = await sectionsResponse.json();
          console.error('Error response:', errorResponse.message);
          throw new Error(errorResponse.message || 'Failed to fetch sections');
        }

        const sections = await sectionsResponse.json();
        const sectionsWithBooks = await Promise.all(sections.map(async (section) => {
          const booksResponse = await fetch(`/api/sections/${section.id}/books`, {
            headers: {
              "Authentication-Token": token,
              'Content-Type': 'application/json',
            },
          });

          if (!booksResponse.ok) {
            const errorText = await booksResponse.text();
            console.error('Error response:', errorText);
            throw new Error(errorText || 'Failed to fetch books');
          }

          const books = await booksResponse.json();
          section.books = books.map(book => {
            const parsedDate = new Date(book.date_created);
            console.log(`Book ID: ${book.id}, Original Date: ${book.date_created}, Parsed Date: ${parsedDate}`);
            return {
              ...book,
              date_created: parsedDate,  // Properly parse the UTC date string
            };
          });
          return section;
        }));

        this.sectionsWithBooks = sectionsWithBooks;
        this.sections = sections; // Ensure sections are also set for the dropdown
        this.recentlyAddedBooks = this.getRecentlyAddedBooks();
        this.highlyRatedBooks = await this.getHighlyRatedBooks(); // Updated to be async
        console.log('Sections with books fetched:', this.sectionsWithBooks);
      } catch (error) {
        console.error('Error fetching sections with books:', error);
      }
    },
    getRecentlyAddedBooks() {
      const books = this.sectionsWithBooks.flatMap(section => section.books);
      if (books.length === 0) {
        console.log('No books found in sections.');
        return [];
      }
    
      console.log('All books with their dates:', books.map(book => ({ id: book.id, date_created: book.date_created })));
    
      // Find the most recent date_created including time
      const mostRecentTimestamp = books.reduce((latest, book) => {
        const bookTimestamp = book.date_created.getTime();  // Ensure it's a Date object
        console.log(`Book ID: ${book.id}, Date Created: ${book.date_created}, Timestamp: ${bookTimestamp}`);
        return bookTimestamp > latest ? bookTimestamp : latest;
      }, 0); // Initializing with the earliest possible timestamp (0 represents the Unix epoch)
    
      console.log('Most recent timestamp found:', mostRecentTimestamp);
    
      // Filter books to only include those added at the most recent timestamp
      const recentlyAdded = books.filter(book => book.date_created.getTime() === mostRecentTimestamp);
    
      console.log('Recently added books:', recentlyAdded);
      return recentlyAdded;
    },
    async getHighlyRatedBooks() {
      const books = this.sectionsWithBooks.flatMap(section => section.books);

      const booksWithRatings = await Promise.all(
        books.map(async book => {
          try {
            const response = await fetch(`/api/books/${book.id}/ratings`, {
              headers: {
                "Authentication-Token": sessionStorage.getItem("token"),
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Error fetching ratings for book ID ${book.id}:`, errorText);
              return null;  // Exclude books with error in fetching ratings
            }

            const data = await response.json();
            const averageRating = data.ratings.length > 0
              ? data.ratings.reduce((sum, rating) => sum + rating.rating, 0) / data.ratings.length
              : 0;

            // Exclude books with no ratings
            if (averageRating > 0) {
              return { ...book, rating: averageRating };
            } else {
              return null;
            }
          } catch (error) {
            console.error(`Error fetching ratings for book ID ${book.id}:`, error);
            return null;
          }
        })
      );

      // Filter out books with no ratings (null entries), sort by rating, and return the top 5
      return booksWithRatings.filter(book => book !== null).sort((a, b) => b.rating - a.rating).slice(0, 5);
    },
    searchBooks() {
      // This method will trigger the computed property `filteredSectionsWithBooks`
      // and update the displayed books based on the search criteria.
    },
    clearSearch() {
      this.selectedSection = '';
      this.searchTitle = '';
      this.searchAuthor = '';
    },
    toggleSection(section) {
      if (section === 'recentlyAddedVisible') {
        this.recentlyAddedVisible = !this.recentlyAddedVisible;
      } else if (section === 'highlyRatedVisible') {
        this.highlyRatedVisible = !this.highlyRatedVisible;
      }
    },
  },
};

export default MainApp;
