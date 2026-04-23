import { render, screen } from '@testing-library/react';
import localeEn from '../../../locales/data.json';
import { IntlProvider } from 'react-intl';
import React from 'react';
import type { Source } from '../../apis/models/sources';

import { CredentialForm } from './CredentialForm';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" defaultLocale="en" messages={localeEn.en}>
      {ui}
    </IntlProvider>
  );

beforeEach(() => {
  jest.useRealTimers();
});

const ocpSource: Source = {
  id: 1,
  uuid: 'uuid-1',
  name: 'OCP Source',
  source_type: 'OCP',
  authentication: { credentials: { cluster_id: 'cluster-abc' } },
  billing_source: null,
  provider_linked: false,
  active: true,
  paused: false,
  current_month_data: false,
  previous_month_data: false,
  has_data: false,
  created_timestamp: '2026-01-15T10:00:00Z',
};

describe('CredentialForm', () => {
  it('renders OCP credentials as disabled', () => {
    renderWithIntl(<CredentialForm source={ocpSource} />);

    const input = screen.getByDisplayValue('cluster-abc');
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it('shows unsupported message for non-OCP source types', () => {
    const legacyAws: Source = { ...ocpSource, source_type: 'AWS', name: 'Legacy' };
    renderWithIntl(<CredentialForm source={legacyAws} />);

    expect(
      screen.getByText(/This integration type \(AWS\) is not supported in the UI\. Only OpenShift is supported at this time\./)
    ).toBeInTheDocument();
  });

  it('shows unsupported message for unknown integration type', () => {
    const unknownSource: Source = { ...ocpSource, source_type: 'UNKNOWN' as any, authentication: {} };
    renderWithIntl(<CredentialForm source={unknownSource} />);
    expect(
      screen.getByText(/This integration type \(UNKNOWN\) is not supported in the UI\. Only OpenShift is supported at this time\./)
    ).toBeInTheDocument();
  });
});
