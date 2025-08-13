import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import Markup from './markup';
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

describe('Markup', () => {
  beforeEach(() => jest.clearAllMocks());

  test('toggles sign and changes markup value', () => {
    const ctx = {
      isDiscount: false,
      markup: '0',
      handleSignChange: jest.fn(),
      handleMarkupDiscountChange: jest.fn(),
    } as any;

    const { container } = renderWithIntl(
      <CostModelContext.Provider value={ctx}>
        <Markup />
      </CostModelContext.Provider>
    );

    fireEvent.click(container.querySelector('#discount')!);
    expect(ctx.handleSignChange).toHaveBeenCalled();

    fireEvent.change(container.querySelector('#markup-input-box')!, { target: { value: '12.34' } });
    expect(ctx.handleMarkupDiscountChange).toHaveBeenCalled();
  });

  test.each(['abc', '1.12345678901'])('shows error for invalid value %s', value => {
    const ctx = {
      isDiscount: false,
      markup: value,
      handleSignChange: jest.fn(),
      handleMarkupDiscountChange: jest.fn(),
    } as any;

    const { container } = renderWithIntl(
      <CostModelContext.Provider value={ctx}>
        <Markup />
      </CostModelContext.Provider>
    );

    // Input should have aria-invalid true and helper rendered
    expect(container.querySelector('#markup-input-box')!.getAttribute('aria-invalid')).toBe('true');
  });
}); 