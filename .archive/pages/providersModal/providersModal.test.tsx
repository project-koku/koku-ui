import { Alert, FormSelect, Modal } from '@patternfly/react-core';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import AttributeField from './attributeField';
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

test('update provider type on select change', () => {
  const view = shallow(<ProvidersModal {...props} />);
  expect(view.find(FormSelect).props().value).toBe('AWS');
  expect(view.find(AttributeField).length).toBe(3);
  view.find(FormSelect).simulate('change', 'OCP');
  expect(view.find(FormSelect).props().value).toBe('OCP');
  expect(view.find(AttributeField).length).toBe(2);
});

test('Alert is shown when aws bucket has a special char', () => {
  const view = shallow(<ProvidersModal {...props} />);
  const input = ')))))';
  getBucketInput(view).simulate('change', input);
  view.update();
  expect(view.find(Alert).length).toBe(1);
  expect(view.find(Alert).props().title).toBe('providers.bucket_error');
});

test('Alert is not shown when aws resource name is arn:aw', () => {
  const view = shallow(<ProvidersModal {...props} />);
  const input = 'arn:aw';
  getResourceNameInput(view).simulate('change', input);
  view.update();
  expect(view.find(Alert).length).toBe(0);
});

test('Alert is shown when aws resource name does not start with arn:aws:', () => {
  const view = shallow(<ProvidersModal {...props} />);
  const input = 'arn:awd';
  getResourceNameInput(view).simulate('change', input);
  view.update();
  expect(view.find(Alert).length).toBe(1);
  expect(view.find(Alert).props().title).toBe('providers.resource_name_error');
});

test('Alert is shown with API error', () => {
  [
    {
      data: { errors: [{ bad_data: 'unknown error' }] },
      error: 'providers.default_error',
    },
    { data: { errors: [{ detail: 'name' }] }, error: 'name' },
    { data: { errors: [{ detail: 'error' }] }, error: 'error' },
  ].forEach(testCase => {
    const mockAxiosError = genAPIError(testCase.data);
    const view = shallow(<ProvidersModal {...props} error={mockAxiosError} />);
    expect(view.find(Alert).length).toBe(1);
    expect(view.find(Alert).props().title).toEqual(testCase.error);
  });
});

function genAPIError(data, status = 401) {
  return {
    config: {},
    message: '',
    name: '',
    response: {
      data,
      status,
      headers: {},
      config: {},
    },
  };
}

function getBucketInput(view: ShallowWrapper<any, any>) {
  return view.find(AttributeField).at(1);
}

function getClusterIDInput(view: ShallowWrapper<any, any>) {
  return view.find(AttributeField).at(1);
}

function getNameInput(view: ShallowWrapper<any, any>) {
  return view.find(AttributeField).at(0);
}

function getResourceNameInput(view: ShallowWrapper<any, any>) {
  return view.find(AttributeField).at(2);
}

function getCancelButton(view: ShallowWrapper<any, any>) {
  expect(view.find(Modal).length).toBe(1);
  expect(view.find(Modal).props().actions.length).toBe(2);
  return shallow(view.find(Modal).props().actions[0]);
}

function getConfirmButton(view: ShallowWrapper<any, any>) {
  expect(view.find(Modal).length).toBe(1);
  expect(view.find(Modal).props().actions.length).toBe(2);
  return shallow(view.find(Modal).props().actions[1]);
}

test('updates provider type to not OCP/AWS will not show any fields', () => {
  const view = shallow(<ProvidersModal {...props} />);
  view.find(FormSelect).simulate('change', 'myOwnType');
  expect(view.find(AttributeField).length).toBe(0);
});

test('clicking cancel closes the modal', () => {
  const view = shallow(<ProvidersModal {...props} />);
  expect(props.closeProvidersModal).not.toBeCalled();
  getCancelButton(view).simulate('click');
  expect(props.closeProvidersModal).toBeCalled();
});

test('AWS provider creation flow', () => {
  const details = {
    name: 'my-provider-aws',
    resourceName: 'arn:aws:id-1',
    bucket: 'bucket-1',
  };
  const view = shallow(<ProvidersModal {...props} />);
  getNameInput(view).simulate('change', details.name);
  getBucketInput(view).simulate('change', details.bucket);
  getResourceNameInput(view).simulate('change', details.resourceName);

  expect(props.addProvider).not.toBeCalled();
  getConfirmButton(view).simulate('click');
  expect(props.addProvider).toBeCalledWith({
    name: details.name,
    type: 'AWS',
    authentication: {
      provider_resource_name: details.resourceName,
    },
    billing_source: {
      bucket: details.bucket,
    },
  });
});

test('OCP provider creation flow', () => {
  const details = {
    name: 'my-provider-ocp',
    clusterID: 'openshift-cluster-1',
  };
  const view = shallow(<ProvidersModal {...props} />);
  view.find(FormSelect).simulate('change', 'OCP');
  getNameInput(view).simulate('change', details.name);
  getClusterIDInput(view).simulate('change', details.clusterID);

  expect(props.addProvider).not.toBeCalled();
  getConfirmButton(view).simulate('click');
  expect(props.addProvider).toBeCalledWith({
    name: details.name,
    type: 'OCP',
    authentication: {
      provider_resource_name: details.clusterID,
    },
  });
});
