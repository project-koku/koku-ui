import { shallow } from 'enzyme';
import React from 'react';
import { App, Props } from './app';
import { FetchStatus } from './store/common';

const props: Props = {
  getProviders: jest.fn(),
  providers: null,
  providersFetchStatus: FetchStatus.none,
  history: {
    push: jest.fn(),
    listen: jest.fn(),
  },
};

test('does not fetch current user if not logged in', () => {
  shallow(<App {...props} />);
});

test('renders login if isLoggedIn is false', () => {
  const view = shallow(<App {...props} />);
  expect(view).toMatchSnapshot();
});

test('renders page layout', () => {
  const view = shallow(<App {...props} />);
  expect(view).toMatchSnapshot();
});
