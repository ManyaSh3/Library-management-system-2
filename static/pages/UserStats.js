export default {
  name: 'UserStats',
  template: `
    <div :style="pageStyle">
      <h2 :style="headerStyle">User Stats</h2>
      <div :style="chartContainerStyle">
        <h4 :style="chartTitleStyle">Your issued books per Section</h4>
        <canvas id="barChart"></canvas>
      </div>
      <div :style="chartContainerStyle">
        <h4 :style="chartTitleStyle"> Your number of Book Issued Over Time</h4>
        <canvas id="lineChart"></canvas>
      </div>
    </div>
  `,
  data() {
    return {
      barChartData: null,
      lineChartData: null,
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
        width: '700px', // Adjust the width of the chart container
        height: '500px', // Adjust the height of the chart container
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
        const barResponse = await fetch('/api/user-bar-data', {
          headers: {
            'Authentication-Token': token,
          },
        });
        if (!barResponse.ok) {
          throw new Error(`Error fetching bar chart data: ${barResponse.statusText}`);
        }
        this.barChartData = await barResponse.json();

        // Fetch line chart data
        const lineResponse = await fetch('/api/user-line-data', {
          headers: {
            'Authentication-Token': token,
          },
        });
        if (!lineResponse.ok) {
          throw new Error(`Error fetching line chart data: ${lineResponse.statusText}`);
        }
        this.lineChartData = await lineResponse.json();

      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    },
    renderCharts() {
      // Ensure that Chart.js is available
      if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded.');
        return;
      }

      // Bar Chart
      const ctxBar = document.getElementById('barChart').getContext('2d');
      new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: this.barChartData.labels,
          datasets: [{
            label: 'Books per Section',
            data: this.barChartData.data,
            backgroundColor: '#42A5F5'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
            data: this.lineChartData.data,
            borderColor: '#42A5F5',
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { maxRotation: 0, minRotation: 0 } },
            y: { beginAtZero: true }
          }
        }
      });

    }
  }
};
