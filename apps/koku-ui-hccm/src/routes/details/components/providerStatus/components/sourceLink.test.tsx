import type { Provider } from 'api/providers';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { SourceLink } from './sourceLink';

jest.mock('components/featureToggle/featureToggle', () => ({
  isOnPremEnabled: false,
}));

const featureToggle = require('components/featureToggle/featureToggle') as {
  isOnPremEnabled: boolean;
};

const provider: Provider = {
  id: '42',
  uuid: 'prov-uuid-1',
  name: 'My Source',
  source_type: 'OCP',
};

const renderLink = (p: Provider = provider) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <SourceLink provider={p} showLabel={false} />
    </IntlProvider>
  );

describe('SourceLink', () => {
  beforeEach(() => {
    featureToggle.isOnPremEnabled = false;
  });

  it('uses SaaS Integrations detail href when on-prem is disabled', () => {
    renderLink();
    const anchor = screen.getByRole('link', { name: 'My Source' });
    expect(anchor).toHaveAttribute('href', '/settings/integrations/detail/42');
  });

  it('uses on-prem Settings path when on-prem is enabled', () => {
    featureToggle.isOnPremEnabled = true;
    renderLink();
    const anchor = screen.getByRole('link', { name: 'My Source' });
    expect(anchor).toHaveAttribute('href', '/openshift/cost-management/settings');
  });
});
