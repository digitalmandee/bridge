import axios from "axios";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BASE_API, // Define base URL for API requests
	headers: {
		Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Authorization header with token
		"Content-Type": "application/json", // Set content type as JSON
	},
});

export default axiosInstance;
