import type { Provider } from 'api/providers';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { SourceLink } from './sourceLink';

jest.mock('components/featureToggle/featureToggle', () => ({
  isOnPremEnabled: false,
  isOnpremSourcesEnabled: true,
}));

const featureToggle = require('components/featureToggle/featureToggle') as {
  isOnPremEnabled: boolean;
  isOnpremSourcesEnabled: boolean;
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
    featureToggle.isOnpremSourcesEnabled = true;
  });

  it('uses SaaS Integrations detail href when on-prem is disabled', () => {
    renderLink();
    const anchor = screen.getByRole('link', { name: 'My Source' });
    expect(anchor).toHaveAttribute('href', '/settings/integrations/detail/42');
  });

  it('uses the vendor detail path and Red Hat category when on-prem is enabled', () => {
    featureToggle.isOnPremEnabled = true;
    renderLink();
    const anchor = screen.getByRole('link', { name: 'My Source' });
    expect(anchor).toHaveAttribute(
      'href',
      '/openshift/cost-management/settings/integrations/detail/prov-uuid-1?category=Red%20Hat'
    );
  });

  it('omits the Red Hat category when KOKU_UI_ONPREM_SOURCES_ENABLED is false', () => {
    featureToggle.isOnPremEnabled = true;
    featureToggle.isOnpremSourcesEnabled = false;
    renderLink();
    const anchor = screen.getByRole('link', { name: 'My Source' });
    expect(anchor).toHaveAttribute('href', '/openshift/cost-management/settings/integrations/detail/prov-uuid-1');
  });
});
