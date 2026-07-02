import { createAxiosInstance } from '@koku-ui/ui-lib/api';

export interface UserData {
  username?: string;
  email?: string;
}

export const fetchCurrentUser = (): Promise<UserData> =>
  createAxiosInstance()
    .get<UserData>('/api/me')
    .then(res => res.data);
