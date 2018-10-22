import { Title } from '@patternfly/react-core';
import * as emotion from 'emotion';
import { shallow } from 'enzyme';
import { createSerializer } from 'jest-emotion';
import React from 'react';
import { TotalSummary } from './TotalSummary';

expect.addSnapshotSerializer(createSerializer(emotion));

test('render total summary', () => {
  const view = shallow(
    <TotalSummary
      value="$27.12"
      totalLabel={'Total Cost'}
      dateLabel={'5 weeks ago'}
    />
  );
  expect(view).toMatchSnapshot();
});
