import Book from './book.js';

const LibrarySection = {
  template: `
    <div class="library-section-container">
      <div v-for="section in sections" :key="section.id" class="section-container">
        <h2 class="section-title">{{ section.title }}</h2>
        <div class="books-container">
          <Book
            v-for="book in section.books"
            :key="book.id"
            :id="book.id"
            :title="book.title"
            :author="book.author"
            :description="book.description"
          />
        </div>
      </div>
    </div>
  `,
  components: {
    Book,
  },
  props: {
    sections: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    const style = document.createElement('style');
    style.textContent = `
      .library-section-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }
      .section-container {
        width: 100%;
        max-width: 1200px;
        margin-bottom: 2rem;
      }
      .section-title {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        color: #2c3e50;
        background: linear-gradient(to right, #ff7e5f, #feb47b);
        -webkit-background-clip: text;
        color: transparent;
        margin-bottom: 1rem;
      }
      .books-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
      }
    `;
    document.head.appendChild(style);
  },
};

export default LibrarySection;
