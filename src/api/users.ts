import axios from 'axios';
import { PagedResponse } from './api';

export interface User {
  uuid: string;
  username: string;
  email: string;
}

export function getCurrentUser() {
  return getUser('current');
}

export function getUser(userId: string) {
  return axios.get<User>(`users/${userId}/`);
}

export function getUsers(page = 1) {
  return axios.get<PagedResponse<User>>('users/', {
    params: {
      page,
    },
  });
}
