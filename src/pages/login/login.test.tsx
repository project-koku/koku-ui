import { AxiosError, AxiosResponse } from 'axios';
import { TextInput } from 'components/textInput';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import { Login, Props } from './login';

const props: Props = {
  fetchStatus: FetchStatus.none,
  login: jest.fn(),
  t: jest.fn(v => v),
};

test('updates username on input change', () => {
  const view = shallow(<Login {...props} />);
  const input = 'Stephen Falken';
  getUsernameInput(view).simulate('change', input);
  expect(getUsernameInput(view).props().value).toBe(input);
});

test('updates password on input change', () => {
  const view = shallow(<Login {...props} />);
  const input = 'Joshua';
  getPasswordInput(view).simulate('change', input);
  expect(getPasswordInput(view).props().value).toBe(input);
});

test('triggers login on form submit', () => {
  const view = shallow(<Login {...props} />);
  const username = 'Stephen Falken';
  const password = 'Joshua';
  const preventDefault = jest.fn();
  getUsernameInput(view).simulate('change', username);
  getPasswordInput(view).simulate('change', password);
  view.find('form').simulate('submit', { preventDefault });
  expect(preventDefault).toBeCalled();
  expect(props.login).toBeCalledWith({
    username,
    password,
  });
});

test('triggers login error on form submit', () => {
  const mockAxiosResponse: AxiosResponse = {
    data: {
      non_field_errors: 'Unable to log in with provided credentials.',
    },
    status: 1,
    statusText: '',
    headers: {},
    config: {},
  };
  const mockAxiosError: AxiosError = {
    config: {},
    message: '',
    name: '',
    response: mockAxiosResponse,
  };
  const view = shallow(<Login {...props} error={mockAxiosError} />);
  const preventDefault = jest.fn();
  view.find('form').simulate('submit', { preventDefault });
  expect(props.login).toBeCalled();
  expect(view.find('.pf-c-alert')).not.toBeNull();
});

function getUsernameInput(view: ShallowWrapper<any, any>) {
  return view.find(TextInput).at(0);
}

function getPasswordInput(view: ShallowWrapper<any, any>) {
  return view.find(TextInput).at(1);
}
