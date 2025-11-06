import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import Distribution from './distribution';
import { CostModelContext } from './context';

jest.mock('react-redux', () => ({
  __esModule: true,
  connect: (mapStateToProps: any, mapDispatchToProps: any) => (Comp: any) => (props: any) => {
    const stateProps = typeof mapStateToProps === 'function' ? mapStateToProps({}, props) : {};
    const dispatchProps = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(jest.fn, () => ({})) : mapDispatchToProps || {};
    return <Comp {...props} {...stateProps} {...dispatchProps} />;
  },
}));

jest.mock('react-intl', () => { const actual = jest.requireActual('react-intl'); return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: () => 'x' }} /> }; });

const renderWithIntl = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Distribution', () => {
  test('changes distribution and toggles checkboxes', () => {
    const ctx = {
      distribution: 'cpu',
      distributeNetwork: true,
      distributePlatformUnallocated: true,
      distributeStorage: true,
      distributeWorkerUnallocated: true,
      handleDistributionChange: jest.fn(),
      handleDistributeNetworkChange: jest.fn(),
      handleDistributePlatformUnallocatedChange: jest.fn(),
      handleDistributeStorageChange: jest.fn(),
      handleDistributeWorkerUnallocatedChange: jest.fn(),
    } as any;

    const { container } = renderWithIntl(
      <CostModelContext.Provider value={ctx}>
        <Distribution />
      </CostModelContext.Provider>
    );

    fireEvent.click(container.querySelector('#memory-distribution')!);
    expect(ctx.handleDistributionChange).toHaveBeenCalled();

    fireEvent.click(container.querySelector('#distribute-platform')!);
    fireEvent.click(container.querySelector('#distribute-worker')!);
    fireEvent.click(container.querySelector('#distribute-network')!);
    fireEvent.click(container.querySelector('#distribute-storage')!);

    expect(ctx.handleDistributePlatformUnallocatedChange).toHaveBeenCalled();
    expect(ctx.handleDistributeWorkerUnallocatedChange).toHaveBeenCalled();
    expect(ctx.handleDistributeNetworkChange).toHaveBeenCalled();
    expect(ctx.handleDistributeStorageChange).toHaveBeenCalled();
  });
}); 