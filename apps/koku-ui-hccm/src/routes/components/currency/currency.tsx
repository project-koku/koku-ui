import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';
import { createMapStateToProps } from 'store/common';
import { getCurrencySymbol } from 'utils/format';
import { setCurrency } from 'utils/sessionStorage';

import { styles } from './currency.styles';

interface CurrencyOwnProps {
  currency?: string;
  isDisabled?: boolean;
  isSessionStorage?: boolean;
  onSelect?: (value: string) => void;
  showLabel?: boolean;
}

interface CurrencyDispatchProps {
  // TBD...
}

interface CurrencyStateProps {
  // TBD...
}

interface CurrencyState {
  // TBD...
}

type CurrencyProps = CurrencyOwnProps & CurrencyDispatchProps & CurrencyStateProps & WrappedComponentProps;

export const currencyOptions: {
  value: string;
}[] = [
  { value: 'AED' },
  { value: 'AUD' },
  { value: 'BRL' },
  { value: 'CAD' },
  { value: 'CHF' },
  { value: 'CNY' },
  { value: 'CZK' },
  { value: 'DKK' },
  { value: 'EUR' },
  { value: 'GBP' },
  { value: 'HKD' },
  { value: 'INR' },
  { value: 'JPY' },
  { value: 'NGN' },
  { value: 'NOK' },
  { value: 'NZD' },
  { value: 'SAR' },
  { value: 'SEK' },
  { value: 'SGD' },
  { value: 'TWD' },
  { value: 'USD' },
  { value: 'ZAR' },
];

class CurrencyBase extends React.Component<CurrencyProps, CurrencyState> {
  protected defaultState: CurrencyState = {
    // TBD...
  };
  public state: CurrencyState = { ...this.defaultState };

  private getSelect = () => {
    const { currency, isDisabled, showLabel = true } = this.props;

    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find(option => option.value === currency);

    return (
      <SelectWrapper
        id="currency-select"
        isDisabled={isDisabled}
        onSelect={this.handleOnSelect}
        options={selectOptions}
        position={showLabel ? 'right' : undefined}
        selection={selection}
      />
    );
  };

  private getSelectOptions = (): SelectWrapperOption[] => {
    const { intl } = this.props;

    const options: SelectWrapperOption[] = [];

    currencyOptions.map(option => {
      options.push({
        toString: () =>
          intl.formatMessage(messages.currencyOptions, {
            [option.value]: getCurrencySymbol(option.value),
            units: option.value,
          }),
        value: option.value,
      });
    });
    return options;
  };

  private handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    const { isSessionStorage = true, onSelect } = this.props;

    // Set currency units via local storage
    if (isSessionStorage) {
      setCurrency(selection.value);
    }
    if (onSelect) {
      onSelect(selection.value);
    }
  };

  public render() {
    const { intl, showLabel = true } = this.props;

    return (
      <div style={styles.currencySelector}>
        {showLabel && (
          <Title headingLevel="h2" size={TitleSizes.md} style={styles.currencyLabel}>
            {intl.formatMessage(messages.currency)}
          </Title>
        )}
        {this.getSelect()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<CurrencyOwnProps, CurrencyStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: CurrencyDispatchProps = {
  // TBD...
};

const CurrencyConnect = connect(mapStateToProps, mapDispatchToProps)(CurrencyBase);
const Currency = injectIntl(CurrencyConnect);

export default Currency;
