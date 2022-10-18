import axios from 'axios';

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
