import { Alert } from '@patternfly/react-core';
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

test('dialog has exclamation triangle icon in the title', () => {
  const view = shallow(<Dialog {...defaultProps} />);
  const icon = view.prop('header').props.children[0];
  expect(icon.type.displayName).toBe('ExclamationTriangleIcon');
  expect(icon.props).toEqual({
    color: 'orange',
    noVerticalAlign: false,
    size: 'sm',
  });
});

test('dialog with a delete action', () => {
  const view = shallow(<Dialog {...defaultProps} actionText="Delete!" />);
  expect(view.props().actions.length).toBe(2);
});

test('dialog with no action', () => {
  const view = shallow(<Dialog {...defaultProps} actionText="" />);
  expect(view.props().actions.length).toBe(1);
});

test('dialog with error', () => {
  const view = shallow(<Dialog {...defaultProps} error="Opps!" />);
  expect(view.find(Alert).props().title).toBe('Opps!');
  expect(view.find(Alert).props().variant).toBe('danger');
});

test('dialog is small', () => {
  const view = shallow(<Dialog {...defaultProps} isSmall />);
  expect(view.props().variant).toBe('small');
});
