import { render, screen, within } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { ReviewCostModelModal } from './reviewCostModelModal';

const costModel = {
  uuid: 'cm-1',
  name: 'Blocked Model',
  sources: [{ name: 'Integration A' }],
} as any;

describe('ReviewCostModelModal', () => {
  test('renders open modal with source list', () => {
    render(
      <IntlProvider locale="en">
        <ReviewCostModelModal costModel={costModel} isOpen onClose={jest.fn()} />
      </IntlProvider>
    );

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/you must unassign any integrations/i)).toBeInTheDocument();
    expect(within(dialog).getByText('Integration A')).toBeInTheDocument();
  });
});
