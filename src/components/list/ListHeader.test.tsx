import { Title } from '@patternfly/react-core';
import * as emotion from 'emotion';
import { shallow } from 'enzyme';
import { createSerializer } from 'jest-emotion';
import React from 'react';
import { ListHeader } from './ListHeader';

expect.addSnapshotSerializer(createSerializer(emotion));

test('render list header', () => {
  const view = shallow(
    <ListHeader>
      <h1>Header Title</h1>
      <small>small description</small>
    </ListHeader>
  );
  expect(view).toMatchSnapshot();
});
