import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { GeneralInfo } from './generalInfo';

jest.mock('routes/settings/components/selector', () => ({
  Selector: (props: any) => (
    <button
      data-testid={props.id}
      type="button"
      onClick={() => props.onSelect?.({}, props.options?.[0]?.value || 'AWS')}
    >
      {props.id}
    </button>
  ),
}));

jest.mock('routes/components/currency', () => ({
  getCurrencyLabel: () => 'USD',
  getCurrencyOptions: () => [{ label: { id: 'usd' }, value: 'USD' }],
}));

describe('GeneralInfo', () => {
  const defaultProps = {
    currency: 'USD',
    description: '',
    name: '',
    onCurrencyChange: jest.fn(),
    onDescriptionChange: jest.fn(),
    onNameChange: jest.fn(),
    onSourceTypeChange: jest.fn(),
    sourceType: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls onNameChange when name input changes', () => {
    const onNameChange = jest.fn();
    const { container } = render(
      <IntlProvider locale="en">
        <GeneralInfo {...defaultProps} onNameChange={onNameChange} />
      </IntlProvider>
    );

    fireEvent.change(container.querySelector('#name')!, { target: { value: 'My Cost Model' } });
    expect(onNameChange).toHaveBeenCalledWith('My Cost Model');
  });

  test('calls onSourceTypeChange when source type is selected', () => {
    const onSourceTypeChange = jest.fn();
    render(
      <IntlProvider locale="en">
        <GeneralInfo {...defaultProps} onSourceTypeChange={onSourceTypeChange} />
      </IntlProvider>
    );

    fireEvent.click(screen.getByTestId('source-type'));
    expect(onSourceTypeChange).toHaveBeenCalledWith('AWS');
  });
});
