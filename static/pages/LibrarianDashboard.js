import store from "../utils/store.js";
import router from "../utils/router.js";

export default {
  name: 'LibrarianDashboard',
  template: `
    <div>
      <h2>Librarian Dashboard</h2>
      <div>
        <h4>Book Requests by Section</h4>
        <img v-if="barImageUrl" :src="barImageUrl" alt="Bar Chart" />
      </div>
      <div>
        <h4>Book Issues Over Time</h4>
        <img v-if="lineImageUrl" :src="lineImageUrl" alt="Line Chart" />
      </div>
      <div>
        <h4>Distribution of Book Requests by Status</h4>
        <img v-if="pieImageUrl" :src="pieImageUrl" alt="Pie Chart" />
      </div>
    </div>
  `,
  data() {
    return {
      barImageUrl: null,
      lineImageUrl: null,
      pieImageUrl: null,
    };
  },
  async created() {
    await this.fetchChartData();
  },
  methods: {
    async fetchChartData() {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch bar chart image
        const barResponse = await fetch('/api/librarian-bar-data', {
          headers: {
            'Authentication-Token': token,
          },
        });
        if (barResponse.ok) {
          this.barImageUrl = URL.createObjectURL(await barResponse.blob());
        }

        // Fetch line chart image
        const lineResponse = await fetch('/api/librarian-line-data', {
          headers: {
            'Authentication-Token': token,
          },
        });
        if (lineResponse.ok) {
          this.lineImageUrl = URL.createObjectURL(await lineResponse.blob());
        }

        // Fetch pie chart image
        const pieResponse = await fetch('/api/librarian-pie-data', {
          headers: {
            'Authentication-Token': token,
          },
        });
        if (pieResponse.ok) {
          this.pieImageUrl = URL.createObjectURL(await pieResponse.blob());
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    }
  }
};
