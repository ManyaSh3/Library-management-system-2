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
        backgroundColor: '#F0F0F0',
        padding: '20px',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
      },
      dashboardContentStyle: {
        textAlign: 'center',
        background: 'white',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        width: '95%',
        maxWidth: '1200px', // Wider for more content
      },
      dashboardTitleStyle: {
        marginBottom: '2rem',
        fontSize: '2.8rem',
        color: '#333',
        fontWeight: 'bold',
      },
      libraryImageStyle: {
        width: '200px',
        height: '120px',
        marginBottom: '1.5rem',
      },
      buttonsContainerStyle: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap', // Allow wrapping on smaller screens
        marginBottom: '2.5rem',
      },
      buttonStyle: {
        display: 'inline-block',
        margin: '0.5rem',
        padding: '0.8rem 2rem',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'black',
        fontWeight: 'bold',
        transition: 'background-color 0.3s, transform 0.3s',
      },
      faqButtonStyle: {
        backgroundColor: '#a6c9e2', // Pastel light blue
      },
      myBooksButtonStyle: {
        backgroundColor: '#a6c9e2', // Pastel light blue
      },
      statsButtonStyle: {
        backgroundColor: '#a6c9e2', // Pastel light blue
      },
    };
  },
  
  methods: {
    updateStyles() {
      if (window.innerWidth <= 768) {
        this.dashboardContentStyle.padding = '1.5rem';
        this.dashboardTitleStyle.fontSize = '2.2rem';
      } else {
        this.dashboardContentStyle.padding = '2.5rem';
        this.dashboardTitleStyle.fontSize = '2.8rem';
      }
    },
  },
};

export default DashboardUser;
