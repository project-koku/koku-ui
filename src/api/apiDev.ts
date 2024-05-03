import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

// For use with API development
//
// See https://www.postman.com/devteamkappa/workspace/rh-hccm/example/9135942-f404beb0-47df-4fe1-8ee5-2265ddcabed7

function devAuthInterceptor(reqConfig: AxiosRequestConfig) {
  const insights = (window as any).insights;
  const userToken = insights?.chrome?.auth?.getToken();

  // For axios mock
  if (!userToken?.then) {
    return undefined;
  }
  return userToken.then(token => {
    if (!token) {
      return reqConfig;
    }
    return {
      ...reqConfig,
      headers: {
        Accept: 'application/json', // Allow to be overridden
        Authorization: `Bearer ${token}`,
        ...(reqConfig?.headers && reqConfig.headers),
      } as any,
    };
  });
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://de907f1b-995c-4a3b-9c28-6bba63e190b7.mock.pstmn.io/api/cost-management/v1/',
});

axiosInstance.interceptors.request.use(devAuthInterceptor);

export default axiosInstance;
