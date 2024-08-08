import store from "../utils/store.js";
import router from "../utils/router.js";

const FAQ = {
  template: `
    <div :style="containerStyle">
      <h1 :style="titleStyle">Frequently Asked Questions</h1>
      <div :style="contentStyle">
        <div v-for="faq in faqs" :key="faq.id" :style="faqItemStyle">
          <div :style="questionStyle">Q: {{ faq.question }}</div>
          <div :style="answerStyle">A: {{ faq.answer }}</div>
        </div>
      </div>
      <footer :style="footerStyle">
        <p :style="footerTextStyle">Library Management System &copy; 2024. All rights reserved.</p>
      </footer>
    </div>
  `,
  data() {
    return {
      faqs: [
        { id: 1, question: "Can I search for books?", answer: "Yes, the library has an inbuilt search feature that allows you to search for books by both name and section." },
        { id: 2, question: "Do I get a personalized dashboard?", answer: "Yes, you get a personalized dashboard with graphs showing section-wise issues, including a bar graph and a donut chart." },
        { id: 3, question: "In how many days will the librarian accept my book issue request?", answer: "The librarian will accept your book issue request at the earliest." },
        { id: 4, question: "What happens if I don't return the book within the time period?", answer: "If you don't return the book within the specified time period, your access will be revoked, and you won't be able to read that book." },
        { id: 5, question: "Can I request a book for a certain amount of days?", answer: "Yes, you can request a book for any number of days between 1 to 7." },
        { id: 6, question: "Can I download books from the library?", answer: "Yes, you can download books from the library after paying a nominal fee." },
        { id: 7, question: "What is the maximum number of days I can issue a book?", answer: "The maximum number of days to issue a book is 7." },
        { id: 8, question: "How many books can I issue at max at a time?", answer: "You can issue up to 5 books at a time." },
      ],
      containerStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9', // Changed to a solid pastel color
        padding: '20px',
      },
      contentStyle: {
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      titleStyle: {
        marginBottom: '3rem',
        fontSize: '3rem',
        color: '#333',
        fontWeight: 'bold',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      },
      faqItemStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        padding: '20px',
        width: '80%',
        maxWidth: '800px',
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      },
      questionStyle: {
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '10px',
        fontSize: '1.25rem',
      },
      answerStyle: {
        color: '#555',
        fontSize: '1rem',
        lineHeight: '1.5',
      },
      footerStyle: {
        flexShrink: 0,
        width: '100%',
        textAlign: 'center',
        padding: '1rem 0',
        backgroundColor: '#2c3e50',
        color: 'white',
      },
      footerTextStyle: {
        margin: 0,
        fontSize: '1rem',
      },
    };
  },
  created() {
    // Check if the user is logged in
    if (!store.state.loggedIn) {
      router.push('/user-login'); // Redirect to login if not authenticated
    }
  },
};

export default FAQ;
