import { render, screen } from '@testing-library/react';
import React from 'react';

import Dialog from './dialog';

const defaultProps = {
  onClose: jest.fn(),
  onProceed: jest.fn(),
  isOpen: true,
  title: 'Test dialog',
  body: <div>This is a test dialog body</div>,
  t: (text: string) => text,
};

test('dialog title renders correctly with icon and title text', () => {
  render(<Dialog {...defaultProps} />);
  expect(screen.getByText('Test dialog')).toMatchSnapshot();
});

test('dialog with a delete action', () => {
  render(<Dialog {...defaultProps} actionText="Delete!" />);
  expect(screen.getByRole('button', { name: 'Delete!' })).not.toBeNull();
});

test('dialog with no action', () => {
  render(<Dialog {...defaultProps} actionText="" />);
  // should only be "x" and "close", so 2 buttons
  expect(screen.getAllByRole('button').length).toBe(2);
});

test('dialog with error', () => {
  render(<Dialog {...defaultProps} error="Opps!" />);
  expect(screen.getByText(/danger alert/i)).not.toBeNull();
  expect(screen.getByText(/opps!/i)).not.toBeNull();
});

test('dialog is small', () => {
  render(<Dialog {...defaultProps} isSmall />);
  expect(screen.getByLabelText(/test dialog/i).getAttribute('class')).toContain('pf-m-sm');
});
