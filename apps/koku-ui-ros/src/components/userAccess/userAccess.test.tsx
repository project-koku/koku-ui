import { render, screen } from '@testing-library/react';
import React from 'react';

import userAccess from './userAccess';

jest.mock('components/async', () => ({
  asyncComponent: () =>
    ({ children }: { children: React.ReactNode }) => <div data-testid="permissions-wrapper">{children}</div>,
}));

describe('userAccess', () => {
  test('wraps a component with permissions', () => {
    const Probe = ({ label }: { label: string }) => <div>{label}</div>;
    const Wrapped = userAccess<{ label: string }>(Probe);

    render(<Wrapped label="inside" />);

    expect(screen.getByTestId('permissions-wrapper')).toBeInTheDocument();
    expect(screen.getByText('inside')).toBeInTheDocument();
  });
});
