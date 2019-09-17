import { Alert } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { shallow } from 'enzyme';
import React from 'react';
import Dialog from './dialog';

const defaultProps = {
  onClose: jest.fn(),
  onProceed: jest.fn(),
  title: 'Test dialog',
  body: <div>This is a test dialog body</div>,
  t: (text: string) => text,
};

test('dialog has exclamation triangle icon ', () => {
  const view = shallow(<Dialog {...defaultProps} />);
  expect(view.find(ExclamationTriangleIcon).props()).toEqual({
    color: 'orange',
    noVerticalAlign: false,
    size: 'xl',
    title: null,
  });
});

test('dialog with a delete action', () => {
  const view = shallow(<Dialog {...defaultProps} actionText="Delete!" />);
  expect(view.props().actions.length).toBe(2);
});

test('dialog with no action', () => {
  const view = shallow(<Dialog {...defaultProps} />);
  expect(view.props().actions.length).toBe(1);
});

test('dialog with error', () => {
  const view = shallow(<Dialog {...defaultProps} error="Opps!" />);
  expect(view.find(Alert).props().title).toBe('Opps!');
  expect(view.find(Alert).props().variant).toBe('danger');
});
