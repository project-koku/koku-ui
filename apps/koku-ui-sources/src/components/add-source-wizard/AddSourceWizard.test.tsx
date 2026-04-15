import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import localeEn from '../../../locales/data.json';
import { IntlProvider } from 'react-intl';

import { AddSourceWizard } from './AddSourceWizard';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" defaultLocale="en" messages={localeEn.en}>
      {ui}
    </IntlProvider>
  );

let capturedOnSubmit: ((values: Record<string, any>) => void) | undefined;

jest.mock('@data-driven-forms/react-form-renderer/form-renderer', () => ({
  __esModule: true,
  default: (props: any) => {
    capturedOnSubmit = props.onSubmit;
    return (
      <div data-testid="mock-form-renderer">
        <button data-testid="mock-submit" onClick={() => props.onSubmit?.({ source_name: 'Test' })}>
          Submit
        </button>
        <button data-testid="mock-cancel" onClick={() => props.onCancel?.()}>
          Cancel
        </button>
      </div>
    );
  },
}));

jest.mock('apis/sources-service', () => ({
  SourcesService: {
    createSource: jest.fn(),
    deleteSource: jest.fn(),
  },
}));

jest.mock('apis/applications-service', () => ({
  ApplicationsService: {
    createApplication: jest.fn(),
  },
}));

function getWizardApiMocks() {
  const { SourcesService } = jest.requireMock<{ SourcesService: { createSource: jest.Mock; deleteSource: jest.Mock } }>(
    'apis/sources-service'
  );
  const { ApplicationsService } = jest.requireMock<{ ApplicationsService: { createApplication: jest.Mock } }>(
    'apis/applications-service'
  );
  return {
    createSource: SourcesService.createSource,
    createApplication: ApplicationsService.createApplication,
    deleteSource: SourcesService.deleteSource,
  };
}

beforeEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  capturedOnSubmit = undefined;
});

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSubmitSuccess: jest.fn(),
};

describe('AddSourceWizard', () => {
  it('renders the modal with OpenShift title', () => {
    renderWithIntl(<AddSourceWizard {...defaultProps} />);
    expect(screen.getByText('Add an OpenShift integration')).toBeInTheDocument();
  });

  it('returns null when not open', () => {
    const { container } = renderWithIntl(<AddSourceWizard {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows cancel confirmation when Cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<AddSourceWizard {...defaultProps} />);

    await user.click(screen.getByTestId('mock-cancel'));

    expect(screen.getByText('Exit integration creation?')).toBeInTheDocument();
    expect(screen.getByText('All inputs will be discarded.')).toBeInTheDocument();
  });

  it('calls onClose when Exit is confirmed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithIntl(<AddSourceWizard {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByTestId('mock-cancel'));
    await user.click(screen.getByText('Exit'));

    expect(onClose).toHaveBeenCalled();
  });

  it('dismisses cancel confirmation when Stay is clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<AddSourceWizard {...defaultProps} />);

    await user.click(screen.getByTestId('mock-cancel'));
    expect(screen.getByText('Exit integration creation?')).toBeInTheDocument();

    await user.click(screen.getByText('Stay'));
    expect(screen.queryByText('Exit integration creation?')).not.toBeInTheDocument();
  });

  it('submits successfully and calls onSubmitSuccess + onClose', async () => {
    const { createSource, createApplication } = getWizardApiMocks();
    createSource.mockResolvedValue({ id: 42, uuid: 'new-uuid' });
    createApplication.mockResolvedValue({});

    const onClose = jest.fn();
    const onSubmitSuccess = jest.fn();
    renderWithIntl(<AddSourceWizard isOpen onClose={onClose} onSubmitSuccess={onSubmitSuccess} />);

    await act(async () => {
      await capturedOnSubmit!({
        source_name: 'My New Source',
        credentials: { cluster_id: 'abc-123' },
      });
    });

    expect(createSource).toHaveBeenCalledWith({
      name: 'My New Source',
      source_type: 'OCP',
      authentication: { credentials: { cluster_id: 'abc-123' } },
    });
    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({ source_id: 42, extra: { cluster_id: 'abc-123' } })
    );
    expect(onSubmitSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('submits with billing_source in extra', async () => {
    const { createSource, createApplication } = getWizardApiMocks();
    createSource.mockResolvedValue({ id: 50, uuid: 'billing-uuid' });
    createApplication.mockResolvedValue({});

    renderWithIntl(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} />);

    await act(async () => {
      await capturedOnSubmit!({
        source_name: 'OCP Source',
        credentials: { cluster_id: 'c1' },
        billing_source: { bucket: 'ignored' },
      });
    });

    expect(createSource).toHaveBeenCalledWith({
      name: 'OCP Source',
      source_type: 'OCP',
      authentication: { credentials: { cluster_id: 'c1' } },
      billing_source: { data_source: { bucket: 'ignored' } },
    });

    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        extra: { cluster_id: 'c1', billing_source: { bucket: 'ignored' } },
      })
    );
  });

  it('always sends source_type OCP regardless of values.source_type', async () => {
    const { createSource, createApplication } = getWizardApiMocks();
    createSource.mockResolvedValue({ id: 1, uuid: 'fallback-uuid' });
    createApplication.mockResolvedValue({});

    renderWithIntl(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Fallback', source_type: 'GCP' });
    });

    expect(createSource).toHaveBeenCalledWith({ name: 'Fallback', source_type: 'OCP' });
  });

  it('shows error alert when createSource fails', async () => {
    const { createSource } = getWizardApiMocks();
    createSource.mockRejectedValue(new Error('Network error'));

    renderWithIntl(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Fail Source' });
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows fallback error message when error has no message', async () => {
    const { createSource } = getWizardApiMocks();
    createSource.mockRejectedValue({});

    renderWithIntl(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Fail Source' });
    });

    expect(screen.getByText('Failed to create integration')).toBeInTheDocument();
  });

  it('cleans up created source when createApplication fails', async () => {
    const { createSource, createApplication, deleteSource } = getWizardApiMocks();
    createSource.mockResolvedValue({ id: 99, uuid: 'cleanup-uuid' });
    createApplication.mockRejectedValue(new Error('App creation failed'));
    deleteSource.mockResolvedValue({});

    renderWithIntl(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Cleanup Source' });
    });

    expect(deleteSource).toHaveBeenCalledWith('cleanup-uuid');
    expect(screen.getByText('App creation failed')).toBeInTheDocument();
  });

  it('handles deleteSource cleanup failure gracefully', async () => {
    const { createSource, createApplication, deleteSource } = getWizardApiMocks();
    createSource.mockResolvedValue({ id: 88, uuid: 'fail-cleanup-uuid' });
    createApplication.mockRejectedValue(new Error('App failed'));
    deleteSource.mockRejectedValue(new Error('Delete also failed'));

    renderWithIntl(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Double Fail' });
    });

    expect(deleteSource).toHaveBeenCalledWith('fail-cleanup-uuid');
    expect(screen.getByText('App failed')).toBeInTheDocument();
  });
});
