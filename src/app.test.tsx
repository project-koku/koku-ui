import { shallow } from 'enzyme';
import React from 'react';
import { App, Props } from './app';

const props: Props = {
  isLoggedIn: false,
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
  currentUser: null,
};

test('does not fetch current user if not logged in', () => {
  shallow(<App {...props} />);
  expect(props.getCurrentUser).not.toBeCalled();
});

test('fetches current user if logged in', () => {
  shallow(<App {...props} isLoggedIn />);
  expect(props.getCurrentUser).toBeCalled();
});

test('fetches current user if isLoggedIn changes to true', () => {
  const view = shallow(<App {...props} />);
  view.setProps({ ...props, isLoggedIn: true });
  expect(props.getCurrentUser).toBeCalled();
});

test('renders login if isLoggedIn is false', () => {
  const view = shallow(<App {...props} />);
  expect(view).toMatchSnapshot();
});

test('renders page layout and routes if isLoggedIn is true', () => {
  const view = shallow(<App {...props} isLoggedIn />);
  expect(view).toMatchSnapshot();
});
