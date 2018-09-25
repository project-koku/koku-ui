import { AxiosRequestConfig } from 'axios';
import { getToken } from './session';

export function authInterceptor(
  reqConfig: AxiosRequestConfig
): AxiosRequestConfig {
  const token = getToken();
  // const user = getUser();
  const identityHeader = btoa(
    JSON.stringify({
      identity: {
        username: 'bar',
        email: 'bar@foo.com',
        account_number: 10001,
        org_id: 20001,
      },
    })
  );
  if (!token) {
    return reqConfig;
  }
  return {
    ...reqConfig,
    headers: {
      ...reqConfig.headers,
      Authorization: `Basic ${token}`,
      'x-rh-identity': identityHeader,
    },
  };
}
