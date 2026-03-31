import type { AxiosInterceptorManager, AxiosResponse, CreateAxiosDefaults } from 'axios';
import axios from 'axios';

export interface PagedMetaData {
  count: number;
}

export interface PagedLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface PagedResponse<D = any, M = any> {
  meta: M;
  links: PagedLinks;
  data: D[];
}

type ResponseInterceptor = Parameters<AxiosInterceptorManager<AxiosResponse>['use']>;

const defaultResponseInterceptors: ResponseInterceptor[] = [];

export const setDefaultResponseInterceptors = (interceptors: ResponseInterceptor[]) => {
  defaultResponseInterceptors.length = 0;
  defaultResponseInterceptors.push(...interceptors);
};

export const createAxiosInstance = (config?: CreateAxiosDefaults<any>) => {
  const axiosInstance = axios.create(config);
  for (const interceptor of defaultResponseInterceptors) {
    axiosInstance.interceptors.response.use(...interceptor);
  }
  return axiosInstance;
};
