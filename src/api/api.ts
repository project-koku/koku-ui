import axios, { AxiosRequestConfig } from 'axios';

export interface PagedResponse<D = any> {
  count: number;
  previous: string;
  next: string;
  results: D[];
}

export function initApi({
  host,
  version,
  token,
}: {
  host: string;
  version: string;
  token: string;
}) {
  axios.defaults.baseURL = `/r/insights/platform/cost-management/api/${version}/`;
  axios.defaults.baseURL = `${host}/r/insights/platform/cost-management/api/${version}/`;
  axios.defaults.headers.common.Authorization = `Basic ${token}`;
  axios.defaults.timeout = 4000;
  axios.interceptors.request.use(authInterceptor);
}

export function authInterceptor(
  reqConfig: AxiosRequestConfig
): AxiosRequestConfig {
  return {
    ...reqConfig,
    headers: {
      ...reqConfig.headers,
    },
  };
}
