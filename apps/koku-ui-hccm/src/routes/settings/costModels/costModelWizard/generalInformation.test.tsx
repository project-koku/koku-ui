import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import GeneralInformation from './generalInformation';
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
  return { __esModule: true, ...actual, injectIntl: (Comp: any) => (props: any) => <Comp {...props} intl={{ formatMessage: () => 'x' }} /> };
});

jest.mock('routes/settings/costModels/components/inputs/selector', () => ({
  __esModule: true,
  Selector: (props: any) => (
    <button data-testid={props.id || 'selector'} onClick={() => props.onSelect({}, props.options?.[0]?.value || 'AWS')}>
      selector
    </button>
  ),
}));

jest.mock('routes/components/currency', () => ({
  __esModule: true,
  getCurrencyLabel: jest.fn(() => 'USD'),
  getCurrencyOptions: jest.fn(() => [{ label: { id: 'x' }, value: 'USD' }]),
}));

const renderWithIntl = (ui: React.ReactElement) => render(<IntlProvider locale="en">{ui}</IntlProvider>);

describe('GeneralInformation', () => {
  const ctxBase = {
    currencyUnits: 'USD',
    dirtyName: false,
    description: '',
    name: '',
    type: '',
    onCurrencyChange: jest.fn(),
    onNameChange: jest.fn(),
    onDescChange: jest.fn(),
    onTypeChange: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls name and description change handlers', () => {
    const { container } = renderWithIntl(
      <CostModelContext.Provider value={ctxBase}>
        <GeneralInformation />
      </CostModelContext.Provider>
    );

    fireEvent.change(container.querySelector('#name')!, { target: { value: 'My Name' } });
    fireEvent.change(container.querySelector('#description')!, { target: { value: 'My Desc' } });

    expect(ctxBase.onNameChange).toHaveBeenCalledWith('My Name');
    expect(ctxBase.onDescChange).toHaveBeenCalledWith('My Desc');
  });

  test('selects source type and currency', () => {
    const { getByTestId } = renderWithIntl(
      <CostModelContext.Provider value={ctxBase}>
        <GeneralInformation />
      </CostModelContext.Provider>
    );

    fireEvent.click(getByTestId('source-type-selector'));
    fireEvent.click(getByTestId('currency-units-selector'));

    expect(ctxBase.onTypeChange).toHaveBeenCalled();
    expect(ctxBase.onCurrencyChange).toHaveBeenCalled();
  });

  test('shows validation error for long description', () => {
    const ctx = { ...ctxBase, description: 'x'.repeat(600) } as any;
    const { container } = renderWithIntl(
      <CostModelContext.Provider value={ctx}>
        <GeneralInformation />
      </CostModelContext.Provider>
    );

    expect(container.querySelector('#description')!.getAttribute('aria-invalid')).toBe('true');
  });
}); 