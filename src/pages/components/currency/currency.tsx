import './currency.scss';

import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Select, SelectOption, SelectOptionObject, SelectVariant, Title } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { getCurrency, invalidateSession, restoreCurrency, setCurrency } from 'utils/localStorage';

import { styles } from './currency.styles';

interface CurrencyOwnProps {
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
}

interface CurrencyDispatchProps {
  // TBD...
}

interface CurrencyStateProps {
  // TBD...
}

interface CurrencyState {
  isSelectOpen: boolean;
}

interface CurrencyOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

type CurrencyProps = CurrencyOwnProps & CurrencyDispatchProps & CurrencyStateProps & WrappedComponentProps;

export const currencyOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.CurrencyOptions, value: 'AUD' },
  { label: messages.CurrencyOptions, value: 'CAD' },
  { label: messages.CurrencyOptions, value: 'CHF' },
  { label: messages.CurrencyOptions, value: 'CNY' },
  { label: messages.CurrencyOptions, value: 'DKK' },
  { label: messages.CurrencyOptions, value: 'EUR' },
  { label: messages.CurrencyOptions, value: 'GBP' },
  { label: messages.CurrencyOptions, value: 'HKD' },
  { label: messages.CurrencyOptions, value: 'JPY' },
  { label: messages.CurrencyOptions, value: 'NOK' },
  { label: messages.CurrencyOptions, value: 'NZD' },
  { label: messages.CurrencyOptions, value: 'SEK' },
  { label: messages.CurrencyOptions, value: 'SGD' },
  { label: messages.CurrencyOptions, value: 'USD' },
  { label: messages.CurrencyOptions, value: 'ZAR' },
];

class CurrencyBase extends React.Component<CurrencyProps> {
  protected defaultState: CurrencyState = {
    isSelectOpen: false,
  };
  public state: CurrencyState = { ...this.defaultState };

  private getSelect = () => {
    const { isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    // Restore from query param if available
    restoreCurrency();

    const currency = getCurrency(); // Get currency from local storage
    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: CurrencyOption) => option.value === currency);

    return (
      <Select
        className="currencyOverride"
        id="currencySelect"
        isDisabled={isDisabled}
        isOpen={isSelectOpen}
        onSelect={this.handleSelect}
        onToggle={this.handleToggle}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption key={option.value} value={option} />
        ))}
      </Select>
    );
  };

  private getSelectOptions = (): CurrencyOption[] => {
    const { intl } = this.props;

    const options: CurrencyOption[] = [];

    currencyOptions.map(option => {
      options.push({
        toString: () => intl.formatMessage(option.label, { units: option.value }),
        value: option.value,
      });
    });
    return options;
  };

  private handleSelect = (event, selection: CurrencyOption) => {
    const { onSelect } = this.props;

    setCurrency(selection.value); // Set currency units via local storage

    this.setState(
      {
        isSelectOpen: false,
      },
      () => {
        if (onSelect) {
          onSelect(selection.value);
        }
      }
    );
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    const { intl } = this.props;

    // Clear local storage value if current session is not valid
    invalidateSession();

    return (
      <div style={styles.currencySelector}>
        <Title headingLevel="h2" size="md" style={styles.currencyLabel}>
          {intl.formatMessage(messages.Currency)}
        </Title>
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

export { Currency };
