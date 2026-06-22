import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { DeleteCostModelAction } from './deleteCostModelAction';

jest.mock('routes/settings/costModels/costModelBreakdown/components/delete', () => ({
  DeleteCostModelModal: ({ isOpen }: any) => (isOpen ? <div data-testid="delete-modal-open" /> : null),
}));

const costModel = { uuid: 'cm-1', name: 'Model' } as any;

describe('DeleteCostModelAction', () => {
  test('clicking delete opens modal', () => {
    render(
      <IntlProvider locale="en">
        <DeleteCostModelAction canWrite costModel={costModel} />
      </IntlProvider>
    );
    expect(screen.queryByTestId('delete-modal-open')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /delete cost model/i }));
    expect(screen.getByTestId('delete-modal-open')).toBeInTheDocument();
  });
});
