import axios from 'axios';

const TOKE_STORAGE_KEY = 'hccm:token';
const USER_STORAGE_KEY = 'hccm:user';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export function login(request: LoginRequest) {
  return axios
    .get<LoginResponse>('status/', { auth: request })
    .then(response => {
      setToken(request);
      return response;
    });
}

export function logout() {
  deleteToken();
}

export function getToken() {
  return localStorage.getItem(TOKE_STORAGE_KEY);
}

export function setToken(auth: LoginRequest) {
  const token = btoa(auth.username + ':' + auth.password);
  localStorage.setItem(TOKE_STORAGE_KEY, token);
}

export function deleteToken() {
  localStorage.removeItem(TOKE_STORAGE_KEY);
}

export function getUser() {
  return localStorage.getItem(USER_STORAGE_KEY);
}

export function setUser(user: string) {
  localStorage.setItem(USER_STORAGE_KEY, user);
}

export function deleteUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}
