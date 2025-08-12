// Re-export the axios mock to satisfy imports of axiosInstance in some tests
import mockAxios from 'axios';
export default mockAxios as any;
