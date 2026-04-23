import { createAxiosInstance } from '@koku-ui/ui-lib/api';

export const API_BASE = '/api/cost-management/v1';

export const axiosInstance = createAxiosInstance({
  headers: {
    'Cache-Control': 'no-cache',
  },
});
