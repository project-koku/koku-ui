import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { IntlProvider } from 'react-intl';

import { DeleteCostModelContent, type DeleteCostModelContentHandle } from './deleteCostModelContent';

const costModelNoSources = { uuid: 'cm-1', name: 'Model A', sources: [] } as any;
const costModelWithSources = {
  uuid: 'cm-2',
  name: 'Model B',
  sources: [{ name: 'Source 1' }, { name: 'Source 2' }],
} as any;

describe('DeleteCostModelContent', () => {
  test('without sources shows delete description', () => {
    render(
      <IntlProvider locale="en">
        <DeleteCostModelContent costModel={costModelNoSources} />
      </IntlProvider>
    );
    expect(screen.getByText(/this action will delete/i)).toBeInTheDocument();
    expect(screen.queryByText(/you must unassign any integrations/i)).not.toBeInTheDocument();
  });

  test('with sources lists integrations and cannot-delete message', () => {
    render(
      <IntlProvider locale="en">
        <DeleteCostModelContent costModel={costModelWithSources} />
      </IntlProvider>
    );
    expect(screen.getByText(/you must unassign any integrations/i)).toBeInTheDocument();
    expect(screen.getByText('Source 1')).toBeInTheDocument();
    expect(screen.getByText('Source 2')).toBeInTheDocument();
  });

  test('ref delete invokes onDelete with cost model', () => {
    const onDelete = jest.fn();
    const ref = createRef<DeleteCostModelContentHandle>();
    render(
      <IntlProvider locale="en">
        <DeleteCostModelContent costModel={costModelNoSources} onDelete={onDelete} ref={ref} />
      </IntlProvider>
    );
    act(() => ref.current?.delete());
    expect(onDelete).toHaveBeenCalledWith(costModelNoSources);
  });
});
