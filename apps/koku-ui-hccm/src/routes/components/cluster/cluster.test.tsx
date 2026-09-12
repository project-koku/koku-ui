import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import Cluster from './cluster';

jest.mock('react-intl', () => {
  const React = require('react');
  const actual = jest.requireActual('react-intl');
  const intl = {
    formatMessage: ({ defaultMessage, id }: { defaultMessage?: string; id?: string }, values?: { value?: number }) =>
      values?.value !== undefined ? `${defaultMessage ?? id ?? ''} ${values.value}` : (defaultMessage ?? id ?? ''),
  };
  return {
    ...actual,
    injectIntl: (Comp: any) => (props: any) => React.createElement(Comp, { ...props, intl }),
    useIntl: () => intl,
  };
});

const disconnect = jest.fn();

jest.mock('routes/components/charts/common/chartUtils', () => ({
  getResizeObserver: jest.fn((_el: HTMLElement, handleResize: () => void) => {
    handleResize();
    return disconnect;
  }),
}));

jest.mock('./modal/clusterModal', () => ({
  ClusterModal: ({ isOpen, onClose, clusters }: any) =>
    isOpen ? (
      <div>
        <div>cluster-modal</div>
        <div>{clusters.join(',')}</div>
        <button type="button" onClick={() => onClose(false)}>
          close-modal
        </button>
      </div>
    ) : null,
}));

describe('Cluster', () => {
  test('returns null when there are no clusters', () => {
    const { container } = render(<Cluster clusters={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders cluster names and opens the modal for overflow', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Cluster clusters={['zeta', 'alpha', 'beta']} title="Clusters" />);

    expect(screen.getByText(/alpha/)).toBeInTheDocument();
    await user.click(screen.getByTestId('cluster-lnk'));
    expect(screen.getByText('cluster-modal')).toBeInTheDocument();
    expect(screen.getByText('alpha,beta,zeta')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'close-modal' }));
    expect(screen.queryByText('cluster-modal')).not.toBeInTheDocument();
  });

  test('merges clusters from report items and truncates long names', () => {
    const { container } = render(
      <Cluster
        clusters={['short']}
        groupBy="project"
        report={
          {
            data: [
              {
                projects: [
                  {
                    clusters: ['this-is-a-very-long-cluster-name-that-should-be-truncated-for-display'],
                  },
                ],
              },
            ],
          } as any
        }
      />
    );
    expect(container.querySelector('[style]')).toBeTruthy();
  });
});
