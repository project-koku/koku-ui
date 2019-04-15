import { Toolbar } from '@patternfly/react-core';
import { shallow } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import SourceSettings from './sourceSettings';

test('hide toolbar when fetch in progress or none', () => {
  const props = {
    sources: [],
    error: null,
    status: FetchStatus.inProgress,
    fetch: jest.fn(),
    remove: jest.fn(),
    showDeleteDialog: jest.fn(),
    onAdd: jest.fn(),
    t: jest.fn(v => v),
  };
  let view = shallow(<SourceSettings {...props} />);
  expect(view.find(Toolbar)).toHaveLength(0);
  view = shallow(<SourceSettings {...props} status={FetchStatus.none} />);
  expect(view.find(Toolbar)).toHaveLength(0);
});

test('display toolbar when fetch completed', () => {
  const props = {
    sources: [],
    error: null,
    status: FetchStatus.complete,
    fetch: jest.fn(),
    remove: jest.fn(),
    showDeleteDialog: jest.fn(),
    onAdd: jest.fn(),
    t: jest.fn(v => v),
  };
  const view = shallow(<SourceSettings {...props} />);
  expect(view.find(Toolbar)).toHaveLength(1);
});
