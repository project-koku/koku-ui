import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    'Cache-Control': 'no-cache',
  },
});

export default axiosInstance;
