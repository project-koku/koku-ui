import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from './session';

export interface PagedResponse<D = any> {
  count: number;
  previous: string;
  next: string;
  results: D[];
}

export function initApi({ host, version }: { host: string; version: string }) {
  axios.defaults.baseURL = `${host}/api/${version}/`;
  axios.interceptors.request.use(authInterceptor);
}

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
