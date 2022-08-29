jest.mock('axios');

import axios from 'axios';
import { getCurrentUser, getUser } from './users';

test('get user calls axios.get', () => {
  const userId = 'USERID1';
  getUser(userId);
  expect(axios.get).toBeCalledWith(`users/${userId}/`);
});

test('get current user call axios.get with userId current ', () => {
  getCurrentUser();
  expect(axios.get).toBeCalledWith('users/current/');
});
