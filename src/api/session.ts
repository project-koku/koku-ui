import axios from 'axios';

const TOKE_STORAGE_KEY = 'hccm:token';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export function login(request: LoginRequest) {
  return axios.post<LoginResponse>('token-auth/', request).then(response => {
    setToken(response.data.token);
    return response;
  });
}

export function logout() {
  deleteToken();
}

export function getToken() {
  return localStorage.getItem(TOKE_STORAGE_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKE_STORAGE_KEY, token);
}

export function deleteToken() {
  localStorage.removeItem(TOKE_STORAGE_KEY);
}
