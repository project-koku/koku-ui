import { createAxiosInstance } from '@koku-ui/ui-lib/api';

export type { PagedLinks, PagedMetaData, PagedResponse } from '@koku-ui/ui-lib/api';

// Create an Axios instance
//
// Note: Setting global defaults may affect the base URL in Cost Management, HCS, and OCM, when navigating between apps
// See https://redhat.atlassian.net/browse/RHCLOUD-25573
const axiosInstance = createAxiosInstance({
  baseURL: '/api/cost-management/v1/',
  headers: {
    'Cache-Control': 'no-cache',
  },
});

export default axiosInstance;
