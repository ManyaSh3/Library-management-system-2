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
          section.books = books;
          return section;
        }));

        this.sectionsWithBooks = sectionsWithBooks;
        this.sections = sections; // Ensure sections are also set for the dropdown
        console.log('Sections with books fetched:', this.sectionsWithBooks);
      } catch (error) {
        console.error('Error fetching sections with books:', error);
      }
    },
    searchBooks() {
      // This method will trigger the computed property `filteredSectionsWithBooks`
      // and update the displayed books based on the search criteria.
    },
    clearSearch() {
      this.selectedSection = '';
      this.searchTitle = '';
      this.searchAuthor = '';
    }
  },
};

export default MainApp;
