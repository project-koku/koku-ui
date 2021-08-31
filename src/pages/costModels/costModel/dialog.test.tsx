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

// Todo: disabled until cost models is converted to react-intl
xtest('dialog has exclamation triangle icon in the title', () => {
  const view = shallow(<Dialog {...defaultProps} />);
  const icon = view.prop('header').props.children[0];
  expect(icon.type.displayName).toBe('ExclamationTriangleIcon');
  expect(icon.props).toEqual({
    color: 'orange',
    noVerticalAlign: false,
    size: 'sm',
  });
});

// Todo: disabled until cost models is converted to react-intl
xtest('dialog with a delete action', () => {
  const view = shallow(<Dialog {...defaultProps} actionText="Delete!" />);
  expect(view.props().actions.length).toBe(2);
});

// Todo: disabled until cost models is converted to react-intl
xtest('dialog with no action', () => {
  const view = shallow(<Dialog {...defaultProps} actionText="" />);
  expect(view.props().actions.length).toBe(1);
});

// Todo: disabled until cost models is converted to react-intl
xtest('dialog with error', () => {
  const view = shallow(<Dialog {...defaultProps} error="Opps!" />);
  expect(view.find(Alert).props().title).toBe('Opps!');
  expect(view.find(Alert).props().variant).toBe('danger');
});

// Todo: disabled until cost models is converted to react-intl
xtest('dialog is small', () => {
  const view = shallow(<Dialog {...defaultProps} isSmall />);
  expect(view.props().variant).toBe('small');
});
