jest.mock('axios');

import axios from 'axios';
import { getToken, login, logout } from './session';

const globalAny: any = global;
globalAny.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
};

test('api session logout removes the token', () => {
  logout();
  expect(globalAny.localStorage.removeItem).toBeCalledWith('hccm:token');
});

test('api session getToken returns HCCM token', () => {
  getToken();
  expect(globalAny.localStorage.getItem).toBeCalledWith('hccm:token');
});

test('api session login calls axios.post and creates a new token', () => {
  const token = btoa('username:password1');
  const resp = { data: { token } };
  const request = { username: 'username', password: 'password1' };

  axios.get = jest.fn(() => Promise.resolve(resp));

  const promise = login(request).then(
    response =>
      expect(response).toEqual(resp) ||
      expect(globalAny.localStorage.setItem).toBeCalledWith('hccm:token', token)
  );

  expect(axios.get).toBeCalledWith('status/', { auth: request });
  return promise;
});
