import { Alert } from '@patternfly/react-core';
import { AxiosError, AxiosResponse } from 'axios';
import { TextInput } from 'components/textInput';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import { Props, ProvidersModal } from './providersModal';

const props: Props = {
  addProvider: jest.fn(),
  clearProviderFailure: jest.fn(),
  closeProvidersModal: jest.fn(),
  fetchStatus: FetchStatus.none,
  isProviderModalOpen: false,
  t: jest.fn(v => v),
};

test('updates provider name on input change', () => {
  const view = shallow(<ProvidersModal {...props} />);
  const input = 'AWSHCCM';
  getNameInput(view).simulate('change', input);
  expect(getNameInput(view).props().value).toBe(input);
});

test('updates bucket name on input change', () => {
  const view = shallow(<ProvidersModal {...props} />);
  const input = 'cost-usage-bucket';
  getBucketInput(view).simulate('change', input);
  expect(getBucketInput(view).props().value).toBe(input);
});

test('updates provider resource name on input change', () => {
  const view = shallow(<ProvidersModal {...props} />);
  const input = 'arn:aws:iam::589173575009:role/CostManagement';
  getResourceNameInput(view).simulate('change', input);
  expect(getResourceNameInput(view).props().value).toBe(input);
});

test('Alert is shown with login error', () => {
  const mockAxiosResponse: AxiosResponse = {
    data: {},
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
  const view = shallow(<ProvidersModal {...props} error={mockAxiosError} />);
  expect(view.find(Alert)).toMatchSnapshot();
});

function getBucketInput(view: ShallowWrapper<any, any>) {
  return view.find(TextInput).at(0);
}

function getNameInput(view: ShallowWrapper<any, any>) {
  return view.find(TextInput).at(1);
}

function getResourceNameInput(view: ShallowWrapper<any, any>) {
  return view.find(TextInput).at(2);
}
