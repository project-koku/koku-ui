jest.mock('axios');

import axios from 'axios';
import { getCurrentUser, getUser, getUsers } from './users';

test('get user calls axios.get', () => {
  const userId = 'USERID1';
  getUser(userId);
  expect(axios.get).toBeCalledWith(`users/${userId}/`);
});

test('get users calls axios.get', () => {
  const page = 100;
  getUsers(page);
  expect(axios.get).toBeCalledWith('users/', { params: { page } });

  getUsers();
  expect(axios.get).toBeCalledWith('users/', { params: { page: 1 } });
});

test('get current user call axios.get with userId current ', () => {
  getCurrentUser();
  expect(axios.get).toBeCalledWith('users/current/');
});
