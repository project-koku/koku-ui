import type { Provider } from 'api/providers';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { SourceLink } from './sourceLink';

jest.mock('components/featureToggle/featureToggle', () => ({
  isSettingsSourcesTabEnabled: false,
}));

const featureToggle = require('components/featureToggle/featureToggle') as {
  isSettingsSourcesTabEnabled: boolean;
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
    featureToggle.isSettingsSourcesTabEnabled = false;
  });

  it('uses SaaS Integrations detail href when Sources tab is disabled', () => {
    renderLink();
    const anchor = screen.getByRole('link', { name: 'My Source' });
    expect(anchor).toHaveAttribute('href', '/settings/integrations/detail/42');
  });

  it('uses on-prem Settings path when Sources tab is enabled', () => {
    featureToggle.isSettingsSourcesTabEnabled = true;
    renderLink();
    const anchor = screen.getByRole('link', { name: 'My Source' });
    expect(anchor).toHaveAttribute('href', '/openshift/cost-management/settings');
  });
});
