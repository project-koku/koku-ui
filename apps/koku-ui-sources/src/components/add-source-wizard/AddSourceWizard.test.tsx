import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddSourceWizard } from './AddSourceWizard';

let capturedOnSubmit: ((values: Record<string, any>) => void) | undefined;
let capturedOnCancel: (() => void) | undefined;

jest.mock('@data-driven-forms/react-form-renderer/form-renderer', () => ({
  __esModule: true,
  default: (props: any) => {
    capturedOnSubmit = props.onSubmit;
    capturedOnCancel = props.onCancel;
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

jest.mock('api/entities', () => ({
  createSource: jest.fn(),
  createApplication: jest.fn(),
  deleteSource: jest.fn(),
}));

beforeEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  capturedOnSubmit = undefined;
  capturedOnCancel = undefined;
});

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSubmitSuccess: jest.fn(),
};

describe('AddSourceWizard', () => {
  it('renders the modal with default title', () => {
    render(<AddSourceWizard {...defaultProps} />);
    expect(screen.getByText('Add source')).toBeInTheDocument();
  });

  it('renders with OCP preselected title', () => {
    render(<AddSourceWizard {...defaultProps} preselectedType="OCP" />);
    expect(screen.getByText('Add an OpenShift source')).toBeInTheDocument();
  });

  it('renders with AWS preselected title', () => {
    render(<AddSourceWizard {...defaultProps} preselectedType="AWS" />);
    expect(screen.getByText('Add an Amazon Web Services source')).toBeInTheDocument();
  });

  it('renders with Azure preselected title', () => {
    render(<AddSourceWizard {...defaultProps} preselectedType="Azure" />);
    expect(screen.getByText('Add a Microsoft Azure source')).toBeInTheDocument();
  });

  it('renders with GCP preselected title', () => {
    render(<AddSourceWizard {...defaultProps} preselectedType="GCP" />);
    expect(screen.getByText('Add a Google Cloud Platform source')).toBeInTheDocument();
  });

  it('renders with unknown preselected type fallback title', () => {
    render(<AddSourceWizard {...defaultProps} preselectedType="UNKNOWN" />);
    expect(screen.getByText('Add source')).toBeInTheDocument();
  });

  it('returns null when not open', () => {
    const { container } = render(<AddSourceWizard {...defaultProps} isOpen={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows cancel confirmation when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<AddSourceWizard {...defaultProps} />);

    await user.click(screen.getByTestId('mock-cancel'));

    expect(screen.getByText('Exit source creation?')).toBeInTheDocument();
    expect(screen.getByText('All inputs will be discarded.')).toBeInTheDocument();
  });

  it('calls onClose when Exit is confirmed', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<AddSourceWizard {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByTestId('mock-cancel'));
    await user.click(screen.getByText('Exit'));

    expect(onClose).toHaveBeenCalled();
  });

  it('dismisses cancel confirmation when Stay is clicked', async () => {
    const user = userEvent.setup();
    render(<AddSourceWizard {...defaultProps} />);

    await user.click(screen.getByTestId('mock-cancel'));
    expect(screen.getByText('Exit source creation?')).toBeInTheDocument();

    await user.click(screen.getByText('Stay'));
    expect(screen.queryByText('Exit source creation?')).not.toBeInTheDocument();
  });

  it('submits successfully and calls onSubmitSuccess + onClose', async () => {
    const { createSource, createApplication } = require('api/entities');
    createSource.mockResolvedValue({ id: 42, uuid: 'new-uuid' });
    createApplication.mockResolvedValue({});

    const onClose = jest.fn();
    const onSubmitSuccess = jest.fn();
    render(<AddSourceWizard isOpen onClose={onClose} onSubmitSuccess={onSubmitSuccess} preselectedType="OCP" />);

    await act(async () => {
      await capturedOnSubmit!({
        source_name: 'My New Source',
        credentials: { cluster_id: 'abc-123' },
      });
    });

    expect(createSource).toHaveBeenCalledWith({ name: 'My New Source', source_type: 'OCP' });
    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({ source_id: 42, extra: { cluster_id: 'abc-123' } })
    );
    expect(onSubmitSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('submits with billing_source in extra', async () => {
    const { createSource, createApplication } = require('api/entities');
    createSource.mockResolvedValue({ id: 50, uuid: 'billing-uuid' });
    createApplication.mockResolvedValue({});

    render(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} preselectedType="AWS" />);

    await act(async () => {
      await capturedOnSubmit!({
        source_name: 'AWS Source',
        credentials: { access_key: 'key' },
        billing_source: { bucket: 'my-bucket' },
      });
    });

    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({ extra: { access_key: 'key', billing_source: { bucket: 'my-bucket' } } })
    );
  });

  it('shows error alert when createSource fails', async () => {
    const { createSource } = require('api/entities');
    createSource.mockRejectedValue(new Error('Network error'));

    render(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} preselectedType="OCP" />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Fail Source' });
    });

    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows fallback error message when error has no message', async () => {
    const { createSource } = require('api/entities');
    createSource.mockRejectedValue({});

    render(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} preselectedType="OCP" />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Fail Source' });
    });

    expect(screen.getByText('Failed to create source')).toBeInTheDocument();
  });

  it('cleans up created source when createApplication fails', async () => {
    const { createSource, createApplication, deleteSource } = require('api/entities');
    createSource.mockResolvedValue({ id: 99, uuid: 'cleanup-uuid' });
    createApplication.mockRejectedValue(new Error('App creation failed'));
    deleteSource.mockResolvedValue({});

    render(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} preselectedType="OCP" />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Cleanup Source' });
    });

    expect(deleteSource).toHaveBeenCalledWith('cleanup-uuid');
    expect(screen.getByText('App creation failed')).toBeInTheDocument();
  });

  it('handles deleteSource cleanup failure gracefully', async () => {
    const { createSource, createApplication, deleteSource } = require('api/entities');
    createSource.mockResolvedValue({ id: 88, uuid: 'fail-cleanup-uuid' });
    createApplication.mockRejectedValue(new Error('App failed'));
    deleteSource.mockRejectedValue(new Error('Delete also failed'));

    render(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} preselectedType="OCP" />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Double Fail' });
    });

    expect(deleteSource).toHaveBeenCalledWith('fail-cleanup-uuid');
    expect(screen.getByText('App failed')).toBeInTheDocument();
  });

  it('uses fallback source_type from values when no preselectedType', async () => {
    const { createSource, createApplication } = require('api/entities');
    createSource.mockResolvedValue({ id: 1, uuid: 'fallback-uuid' });
    createApplication.mockResolvedValue({});

    render(<AddSourceWizard isOpen onClose={jest.fn()} onSubmitSuccess={jest.fn()} />);

    await act(async () => {
      await capturedOnSubmit!({ source_name: 'Fallback', source_type: 'GCP' });
    });

    expect(createSource).toHaveBeenCalledWith({ name: 'Fallback', source_type: 'GCP' });
  });
});
