import { AxiosRequestConfig } from 'axios';
import { getToken } from './session';

export function authInterceptor(
  reqConfig: AxiosRequestConfig
): AxiosRequestConfig {
  const token = getToken();
  if (!token) {
    return reqConfig;
  }
  return {
    ...reqConfig,
    headers: {
      ...reqConfig.headers,
      Authorization: `Token ${token}`,
    },
  };
}
