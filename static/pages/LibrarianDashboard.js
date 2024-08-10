import store from "../utils/store.js";
import router from "../utils/router.js";

export default {
  name: 'LibrarianDashboard',
  template: `
    <div :style="pageStyle">
      <h2 :style="headerStyle">Librarian Dashboard</h2>
      <div :style="chartContainerStyle">
        <h4 :style="chartTitleStyle">Book per Section</h4>
        <canvas id="barChart"></canvas>
      </div>
      <div :style="chartContainerStyle">
        <h4 :style="chartTitleStyle">Book Issues Over Time</h4>
        <canvas id="lineChart"></canvas>
      </div>
      <div :style="piechartContainerStyle">
        <h4 :style="chartTitleStyle">Distribution of Book Requests by Status</h4>
        <canvas id="pieChart"></canvas>
      </div>
    </div>
  `,
  data() {
    return {
      barChartData: null,
      lineChartData: null,
      pieChartData: null,
      pageStyle: {
        padding: '20px',
        backgroundColor: '#f9f9f9',
        fontFamily: 'Arial, sans-serif',
      },
      headerStyle: {
        textAlign: 'center',
        marginBottom: '40px',
        fontSize: '2rem',
        color: '#333',
      },
      chartContainerStyle: {
        width: '700px',
        height: 'auto', // Adjust height automatically based on the content
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      piechartContainerStyle: {
        width: '700px', // Adjust the width of the chart container
        height: '500px', // Adjust the height of the chart container
        maxHeight: '700px', // Adjust the height of the chart container
        margin: '40px auto', // Center the chart container with spacing
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      chartTitleStyle: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.5rem',
        color: '#555',
      },
    };
  },
  async created() {
    await this.fetchChartData();
    this.renderCharts();
  },
  methods: {
    async fetchChartData() {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch bar chart data
        const barResponse = await fetch('/api/librarian-bar-data', {
          headers: {
            'Authentication-Token': token,
          },
        });
        this.barChartData = await barResponse.json();

        // Fetch line chart data
        const lineResponse = await fetch('/api/librarian-line-data', {
          headers: {
            'Authentication-Token': token,
          },
        });
        this.lineChartData = await lineResponse.json();

        // Fetch pie chart data
        const pieResponse = await fetch('/api/librarian-pie-data', {
          headers: {
            'Authentication-Token': token,
          },
        });
        this.pieChartData = await pieResponse.json();
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    },
    renderCharts() {
      if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded.');
        return;
      }

      // Bar Chart
      const ctxBar = document.getElementById('barChart').getContext('2d');
      new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: this.barChartData.labels, // Use section names as labels
          datasets: [{
            label: 'Books per Section',
            data: this.barChartData.values,
            backgroundColor: '#42A5F5'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true, // Maintain aspect ratio
          scales: {
            x: { ticks: { maxRotation: 0, minRotation: 0 } },
            y: { beginAtZero: true }
          }
        }
      });

      // Line Chart
      const ctxLine = document.getElementById('lineChart').getContext('2d');
      new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: this.lineChartData.labels,
          datasets: [{
            label: 'Book Issues Over Time',
            data: this.lineChartData.values,
            borderColor: '#42A5F5',
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: { ticks: { maxRotation: 0, minRotation: 0 } },
            y: { beginAtZero: true }
          }
        }
      });

      // Pie Chart
      const ctxPie = document.getElementById('pieChart').getContext('2d');
      new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: this.pieChartData.labels,
          datasets: [{
            data: this.pieChartData.values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.8,
        }
      });
    }
  }
};
