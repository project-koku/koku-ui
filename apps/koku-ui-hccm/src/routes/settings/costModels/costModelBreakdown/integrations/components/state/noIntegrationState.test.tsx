import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { NoIntegrationState } from './noIntegrationState';

jest.mock('../actions', () => ({
  AddIntegrationAction: () => <button type="button">assign-sources</button>,
}));

const costModel = { uuid: 'cm-1', name: 'Model', source_type: 'OpenShift Container Platform' } as any;

describe('NoIntegrationState', () => {
  test('renders empty integration state', () => {
    render(
      <IntlProvider locale="en">
        <NoIntegrationState canWrite costModel={costModel} onAdd={jest.fn()} />
      </IntlProvider>
    );
    expect(screen.getByRole('button', { name: /assign-sources/i })).toBeInTheDocument();
  });
});
