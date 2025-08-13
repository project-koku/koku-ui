import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import Review from './review';
import { CostModelContext } from './context';

jest.mock('react-redux', () => ({
  __esModule: true,
  connect: (mapStateToProps: any, mapDispatchToProps: any) => (Comp: any) => (props: any) => {
    const stateProps = typeof mapStateToProps === 'function' ? mapStateToProps({}, props) : {};
    const dispatchProps = typeof mapDispatchToProps === 'function' ? mapDispatchToProps(jest.fn, () => ({})) : mapDispatchToProps || {};
    return <Comp {...props} {...stateProps} {...dispatchProps} />;
  },
}));

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: () => '' }} /> };
});

jest.mock('routes/settings/costModels/components/warningIcon', () => ({ __esModule: true, WarningIcon: () => <span data-testid="warning" /> }));

const renderWithIntl = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('Review', () => {
  test('renders details when not successful', () => {
    const ctx = { createSuccess: false, checked: {}, name: 'N', description: '', currencyUnits: 'USD', tiers: [], type: 'AWS', isDiscount: false, markup: '5', distribution: 'cpu', distributeNetwork: true, distributePlatformUnallocated: true, distributeStorage: true, distributeWorkerUnallocated: true } as any;
    renderWithIntl(
      <CostModelContext.Provider value={ctx}>
        <Review />
      </CostModelContext.Provider>
    );
    // details contain a dl element
    expect(document.querySelector('dl')).toBeTruthy();
  });

  test('renders success when createSuccess true', () => {
    const ctx = { createSuccess: true, onClose: jest.fn(), name: 'N' } as any;
    renderWithIntl(
      <CostModelContext.Provider value={ctx}>
        <Review />
      </CostModelContext.Provider>
    );
    // empty state with a link-style button exists
    expect(document.querySelector('.pf-m-link')).toBeTruthy();
  });

  test('shows warning for selected sources with cost model', () => {
    const ctx = { createSuccess: false, checked: { a: { selected: true, meta: { name: 's', costmodel: true } } }, name: 'N', description: '', currencyUnits: 'USD', tiers: [], type: 'AWS', isDiscount: false, markup: '5', distribution: 'cpu', distributeNetwork: true, distributePlatformUnallocated: true, distributeStorage: true, distributeWorkerUnallocated: true } as any;
    renderWithIntl(
      <CostModelContext.Provider value={ctx}>
        <Review />
      </CostModelContext.Provider>
    );
    expect(screen.getByTestId('warning')).toBeInTheDocument();
  });
}); 