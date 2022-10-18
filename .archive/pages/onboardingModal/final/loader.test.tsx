import { Alert, Title } from '@patternfly/react-core';
import { shallow } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import Item from './item';
import Loader from './loader';

const props = {
  type: 'OCP',
  name: 'hccm-ocp',
  clusterId: '122-3321',
  t: jest.fn(v => v),
  apiErrors: null,
  apiStatus: FetchStatus.none,
};

test('Failure mode', () => {
  const view = shallow(
    <Loader
      {...props}
      apiErrors={{
        response: {
          data: { errors: [{ detail: 'Cluster ID is not unique' }] },
        },
      }}
      apiStatus={FetchStatus.complete}
    />
  );
  expect(view.find(Alert)).toHaveLength(1);
  expect(view.find(Alert).props().title).toBe(
    'Cluster ID is not unique. onboarding.final.please_revise'
  );
});

test('Failure mode 2', () => {
  const view = shallow(
    <Loader
      {...props}
      apiErrors={{ message: 'Oops' }}
      apiStatus={FetchStatus.complete}
    />
  );
  expect(view.find(Alert)).toHaveLength(1);
  expect(view.find(Alert).props().title).toBe(
    'Oops. onboarding.final.please_revise'
  );
});

test('Success mode', () => {
  const view = shallow(
    <Loader {...props} apiErrors={null} apiStatus={FetchStatus.complete} />
  );
  expect(view.find(Alert)).toHaveLength(0);
});

test('Show OCP source details', () => {
  const view = shallow(
    <Loader {...props} apiErrors={null} apiStatus={FetchStatus.inProgress} />
  );
  expect(view.find(Item)).toHaveLength(3);
  expect(
    view
      .find(Item)
      .at(0)
      .props().title
  ).toBe('onboarding.final.name');
  expect(
    view
      .find(Item)
      .at(0)
      .props().value
  ).toBe(props.name);
  expect(
    view
      .find(Item)
      .at(1)
      .props().title
  ).toBe('onboarding.final.type.title');
  expect(
    view
      .find(Item)
      .at(1)
      .props().value
  ).toBe('onboarding.final.type.OCP');
  expect(
    view
      .find(Item)
      .at(2)
      .props().title
  ).toBe('onboarding.final.cluster');
  expect(
    view
      .find(Item)
      .at(2)
      .props().value
  ).toBe(props.clusterId);
});

test('Show AWS source details', () => {
  const arn = 'arn:aws:123';
  const view = shallow(
    <Loader
      {...props}
      type={'AWS'}
      arn={arn}
      apiErrors={null}
      apiStatus={FetchStatus.inProgress}
    />
  );
  expect(view.find(Item)).toHaveLength(3);
  expect(
    view
      .find(Item)
      .at(0)
      .props().title
  ).toBe('onboarding.final.name');
  expect(
    view
      .find(Item)
      .at(0)
      .props().value
  ).toBe(props.name);
  expect(
    view
      .find(Item)
      .at(1)
      .props().title
  ).toBe('onboarding.final.type.title');
  expect(
    view
      .find(Item)
      .at(1)
      .props().value
  ).toBe('onboarding.final.type.AWS');
  expect(
    view
      .find(Item)
      .at(2)
      .props().title
  ).toBe('onboarding.final.arn');
  expect(
    view
      .find(Item)
      .at(2)
      .props().value
  ).toBe(arn);
});
