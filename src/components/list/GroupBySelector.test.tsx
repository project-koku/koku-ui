import { Title } from '@patternfly/react-core';
import * as emotion from 'emotion';
import { shallow } from 'enzyme';
import { createSerializer } from 'jest-emotion';
import React from 'react';
import { GroupBySelector } from './GroupBySelector';

expect.addSnapshotSerializer(createSerializer(emotion));

test('render GroupBySelector without options', () => {
  const view = shallow(
    <GroupBySelector
      title="My Charges"
      label="GROUP CHRGS BY"
      onChange={jest.fn()}
    />
  );
  expect(view).toMatchSnapshot();
});

test('render GroupBySelector with options', () => {
  const view = shallow(
    <GroupBySelector
      title="My Charges"
      label="GROUP CHRGS BY"
      onChange={jest.fn()}
      initValue="initial value!"
      options={[{ value: '14', label: '14th' }, { value: '21', label: '21st' }]}
    />
  );
  expect(view).toMatchSnapshot();
});
