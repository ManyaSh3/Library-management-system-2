import store from '../utils/store.js';

const ViewRequest = {
  template: `
    <div>
      <h2 class="text-center my-4">Book Requests</h2>
      <div v-if="requests.length === 0" class="text-center">
        No book requests found.
      </div>
      <div v-for="request in requests" :key="request.id" class="card mb-3 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">{{ request.book_title }} by {{ request.book_author }}</h5>
          <p class="card-text">Requested by User ID: {{ request.user_id }}</p>
          <p class="card-text">Requested on: {{ new Date(request.date_requested).toLocaleDateString() }}</p>
          <div>
            <button @click="approveRequest(request.id)" class="btn btn-success mr-2">Approve</button>
            <button @click="rejectRequest(request.id)" class="btn btn-danger">Reject</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      requests: [],
    };
  },
  methods: {
    async fetchRequests() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${window.location.origin}/api/book-requests`, {
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);  // Debugging line
          throw new Error(errorText || 'Failed to fetch book requests');
        }

        this.requests = await response.json();
        console.log('Requests fetched:', this.requests);  // Debugging line
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    },
    async approveRequest(requestId) {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${window.location.origin}/api/book-requests/${requestId}/approve`, {
          method: 'POST',
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);  // Debugging line
          throw new Error(errorText || 'Failed to approve book request');
        }

        // Refresh the requests list after approval
        this.fetchRequests();
      } catch (error) {
        console.error('Error approving request:', error);
      }
    },
    async rejectRequest(requestId) {
      try {
        const token =  sessionStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${window.location.origin}/api/book-requests/${requestId}/reject`, {
          method: 'POST',
          headers: {
            "Authentication-Token": sessionStorage.getItem("token"),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);  // Debugging line
          throw new Error(errorText || 'Failed to reject book request');
        }

        // Refresh the requests list after rejection
        this.fetchRequests();
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    },
  },
  created() {
    this.fetchRequests();
  },
};

export default ViewRequest;
