import MainApp from "../components/MainApp.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const DashboardUser = {
  template: `
    <div :style="dashboardContainerStyle">
      <div :style="dashboardContentStyle">
        <h1 :style="dashboardTitleStyle">
          <img src="/static/books.jpg" alt="Library" :style="libraryImageStyle">
          Welcome to Your Dashboard
        </h1>
        <div :style="buttonsContainerStyle">
          <router-link :style="[buttonStyle, faqButtonStyle]" to="/faq">FAQ</router-link>
          <router-link :style="[buttonStyle, myBooksButtonStyle]" to="/borrowed_books">My Books</router-link>
          <router-link :style="[buttonStyle, statsButtonStyle]" to="/dashboard-user">Stats</router-link>
        </div>
        <MainApp />
      </div>
    </div>
  `,
  components: {
    MainApp,
  },
  created() {
    // Check if the user is logged in
    if (!store.state.loggedIn) {
      router.push('/user-login'); // Redirect to login if not authenticated
    }

    this.updateStyles();
    window.addEventListener('resize', this.updateStyles);
  },
  destroyed() {
    window.removeEventListener('resize', this.updateStyles);
  },
  data() {
    return {
      dashboardContainerStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F5F5DC', // Changed to beige only
        padding: '20px',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
      },
      dashboardContentStyle: {
        textAlign: 'center',
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '900px', // Adjusted for more content
      },
      dashboardTitleStyle: {
        marginBottom: '2rem',
        fontSize: '2.5rem',
        color: '#555',
        fontWeight: 'bold',
      },
      libraryImageStyle: {
        width: '180px',
        height: '110px',
        marginBottom: '1rem',
      },
      buttonsContainerStyle: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
      },
      buttonStyle: {
        display: 'inline-block',
        margin: '0.5rem',
        padding: '0.7rem 1.5rem',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'black', // Changed to black
        fontWeight: 'bold',
        transition: 'background-color 0.3s, transform 0.3s',
      },
      faqButtonStyle: {
        backgroundColor: '#FFABAB',
      },
      myBooksButtonStyle: {
        backgroundColor: '#FFC3A0',
      },
      statsButtonStyle: {
        backgroundColor: '#FFDD94',
      },
    };
  },
  methods: {
    updateStyles() {
      if (window.innerWidth <= 768) {
        this.dashboardContentStyle.padding = '1rem';
        this.dashboardTitleStyle.fontSize = '2rem';
      } else {
        this.dashboardContentStyle.padding = '2rem';
        this.dashboardTitleStyle.fontSize = '2.5rem';
      }
    },
  },
};

export default DashboardUser;
