import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Source } from 'typings/source';

import { CredentialForm } from './CredentialForm';

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

const awsSource: Source = {
  id: 2,
  uuid: 'uuid-2',
  name: 'AWS Source',
  source_type: 'AWS',
  authentication: { credentials: { role_arn: 'arn:aws:iam::role/test' } },
  billing_source: { data_source: { bucket: 'my-bucket' } },
  provider_linked: false,
  active: true,
  paused: false,
  current_month_data: false,
  previous_month_data: false,
  has_data: false,
  created_timestamp: '2026-01-15T10:00:00Z',
};

const azureSource: Source = {
  id: 3,
  uuid: 'uuid-3',
  name: 'Azure Source',
  source_type: 'Azure',
  authentication: {
    credentials: {
      subscription_id: 'sub-123',
      tenant_id: 'tenant-456',
      client_id: 'client-789',
      client_secret: 's3cret',
    },
  },
  billing_source: {
    data_source: { resource_group: 'rg-1', storage_account: 'sa-1' },
  },
  provider_linked: false,
  active: true,
  paused: false,
  current_month_data: false,
  previous_month_data: false,
  has_data: false,
  created_timestamp: '2026-01-15T10:00:00Z',
};

const gcpSource: Source = {
  id: 4,
  uuid: 'uuid-4',
  name: 'GCP Source',
  source_type: 'GCP',
  authentication: { credentials: { project_id: 'proj-1' } },
  billing_source: { data_source: { dataset: 'ds-1', table_id: 'tbl-1' } },
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
    render(<CredentialForm source={ocpSource} />);

    const input = screen.getByDisplayValue('cluster-abc');
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it('renders AWS credentials as editable', () => {
    render(<CredentialForm source={awsSource} />);

    expect(screen.getByDisplayValue('arn:aws:iam::role/test')).toBeEnabled();
    expect(screen.getByDisplayValue('my-bucket')).toBeEnabled();
  });

  it('renders Azure credentials with secret field masked', () => {
    render(<CredentialForm source={azureSource} />);

    expect(screen.getByDisplayValue('sub-123')).toBeInTheDocument();
    const secretInput = screen.getByDisplayValue('s3cret');
    expect(secretInput).toHaveAttribute('type', 'password');
  });

  it('renders GCP credentials', () => {
    render(<CredentialForm source={gcpSource} />);

    expect(screen.getByDisplayValue('proj-1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ds-1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('tbl-1')).toBeInTheDocument();
  });

  it('returns null for unknown source type with no credentials', () => {
    const unknownSource: Source = { ...ocpSource, source_type: 'UNKNOWN' as any, authentication: {} };
    const { container } = render(<CredentialForm source={unknownSource} />);
    expect(container.innerHTML).toBe('');
  });

  it('enables Save and Reset when a field is changed', async () => {
    const user = userEvent.setup();
    render(<CredentialForm source={awsSource} />);

    const saveBtn = screen.getByText('Save').closest('button')!;
    const resetBtn = screen.getByText('Reset').closest('button')!;

    expect(saveBtn).toBeDisabled();
    expect(resetBtn).toBeDisabled();

    const roleInput = screen.getByDisplayValue('arn:aws:iam::role/test');
    await user.clear(roleInput);
    await user.type(roleInput, 'new-arn');

    expect(saveBtn).toBeEnabled();
    expect(resetBtn).toBeEnabled();
  });

  it('calls onSave with form values when Save is clicked', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<CredentialForm source={awsSource} onSave={onSave} />);

    const roleInput = screen.getByDisplayValue('arn:aws:iam::role/test');
    await user.clear(roleInput);
    await user.type(roleInput, 'updated-arn');
    await user.click(screen.getByText('Save').closest('button')!);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ role_arn: 'updated-arn', s3_bucket: 'my-bucket' })
    );
  });

  it('resets form values when Reset is clicked', async () => {
    const user = userEvent.setup();
    render(<CredentialForm source={awsSource} />);

    const roleInput = screen.getByDisplayValue('arn:aws:iam::role/test');
    await user.clear(roleInput);
    await user.type(roleInput, 'changed');

    await user.click(screen.getByText('Reset').closest('button')!);

    expect(screen.getByDisplayValue('arn:aws:iam::role/test')).toBeInTheDocument();
  });

  it('does not show Save/Reset buttons for OCP sources', () => {
    render(<CredentialForm source={ocpSource} />);

    expect(screen.queryByText('Save')).not.toBeInTheDocument();
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });
});
