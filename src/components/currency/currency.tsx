import './currency.scss';

import { Select, SelectOption, SelectOptionObject, SelectVariant, Title } from '@patternfly/react-core';
import { Currency } from 'api/currency';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { currencyActions, currencySelectors } from 'store/currency';
import { getCurrency, invalidateCurrency, setCurrency } from 'utils/localStorage';

import { styles } from './currency.styles';

interface CurrencyOwnProps {
  isDisabled?: boolean;
}

interface CurrencyDispatchProps {
  fetchCurrency?: typeof currencyActions.fetchCurrency;
}

interface CurrencyStateProps {
  currency: Currency;
  currencyError: AxiosError;
  currencyFetchStatus?: FetchStatus;
}

interface CurrencyState {
  currentItem: string;
  isSelectOpen: boolean;
}

interface CurrencyOption extends SelectOptionObject {
  id?: string;
  toString(): string;
}

type CurrencyProps = CurrencyOwnProps & CurrencyDispatchProps & CurrencyStateProps & WrappedComponentProps;

class CurrencyBase extends React.Component<CurrencyProps> {
  protected defaultState: CurrencyState = {
    currentItem: 'USD',
    isSelectOpen: false,
  };
  public state: CurrencyState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchCurrency } = this.props;

    fetchCurrency();
  }

  private getOptions = (): CurrencyOption[] => {
    const { currency, intl } = this.props;

    const options: CurrencyOption[] = [];

    if (currency) {
      currency.data.map(val => {
        options.push({
          id: val.code,
          toString: () => intl.formatMessage(messages.CurrencyOptions, { units: val.code }),
        });
      });
    } else {
      options.push({
        id: 'USD',
        toString: () => intl.formatMessage(messages.CurrencyOptions, { units: 'USD' }),
      });
    }
    return options;
  };

  private getCurrentItem = () => {
    const { currentItem } = this.state;

    const currencyUnits = getCurrency(); // Get currency units from local storage
    return currencyUnits ? currencyUnits : currentItem;
  };

  private getSelect = () => {
    const { isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const currentItem = this.getCurrentItem();
    const selections = this.getOptions();
    const selection = selections.find((item: CurrencyOption) => item.id === currentItem);

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
        {selections.map(item => (
          <SelectOption key={item.id} value={item} />
        ))}
      </Select>
    );
  };

  private handleSelect = (event, selection: CurrencyOption) => {
    this.setState({
      currentItem: selection.id,
      isSelectOpen: false,
    });
    setCurrency(selection.id); // Set currency units via local storage
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    const { intl } = this.props;

    // Todo: Show new features in beta environment only
    if (!insights.chrome.isBeta()) {
      return null;
    }

    // Clear local storage value if current session is not valid
    invalidateCurrency();

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

const mapStateToProps = createMapStateToProps<CurrencyOwnProps, CurrencyStateProps>(state => {
  const currency = currencySelectors.selectCurrency(state);
  const currencyError = currencySelectors.selectCurrencyError(state);
  const currencyFetchStatus = currencySelectors.selectCurrencyFetchStatus(state);

  return {
    currency,
    currencyError,
    currencyFetchStatus,
  };
});

const mapDispatchToProps: CurrencyDispatchProps = {
  fetchCurrency: currencyActions.fetchCurrency,
};

const CurrencyConnect = connect(mapStateToProps, mapDispatchToProps)(CurrencyBase);
const Currency = injectIntl(CurrencyConnect);

export { Currency };
