import { GridItem, Title } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  InProgressIcon,
  TimesCircleIcon,
} from '@patternfly/react-icons';
import { shallow } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import Loader from './loader';

const props = {
  type: 'OCP',
  name: 'hccm-ocp',
  clusterId: '122-3321',
  t: jest.fn(v => v),
  addSource: jest.fn(),
};

test('In Progress mode', () => {
  const view = shallow(
    <Loader {...props} apiErrors={null} apiStatus={FetchStatus.inProgress} />
  );
  expect(view.find(InProgressIcon)).toHaveLength(1);
});

test('Failure mode', () => {
  const view = shallow(
    <Loader
      {...props}
      apiErrors={{ response: { data: { Error: 'Cluster ID is not unique' } } }}
      apiStatus={FetchStatus.complete}
    />
  );
  expect(view.find(TimesCircleIcon)).toHaveLength(1);
  expect(
    view
      .find('div')
      .find(Title)
      .props().children
  ).toBe('Failed adding source');
  expect(
    view
      .find(GridItem)
      .find('div')
      .find('div')
      .at(1)
      .props().children
  ).toBe('Cluster ID is not unique');
});

test('Success mode', () => {
  const view = shallow(
    <Loader {...props} apiErrors={null} apiStatus={FetchStatus.complete} />
  );
  expect(view.find(CheckCircleIcon)).toHaveLength(1);
  expect(
    view
      .find('div')
      .find(Title)
      .props().children
  ).toBe('Successfully added this source');
});

test('Show source details', () => {
  const view = shallow(
    <Loader {...props} apiErrors={null} apiStatus={FetchStatus.inProgress} />
  );
  expect(
    view
      .find(GridItem)
      .find('div')
      .at(0)
      .props().children
  ).toEqual(['Source Name: ', 'hccm-ocp']);
  expect(
    view
      .find(GridItem)
      .find('div')
      .at(1)
      .props().children
  ).toEqual(['Source Type: ', 'OCP']);
  expect(
    view
      .find(GridItem)
      .find('div')
      .at(2)
      .props().children
  ).toEqual(['Cluster ID: ', '122-3321']);
});
