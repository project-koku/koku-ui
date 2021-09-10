import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Dropdown, DropdownItem, DropdownToggle, Title } from '@patternfly/react-core';
import { Currency } from 'api/currency';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { currencyActions, currencySelectors } from 'store/currency';
import { getTokenCookie } from 'utils/cookie';

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
  isCurrencyOpen: boolean;
}

interface CurrencyOptions {
  label: MessageDescriptor;
  value: string;
}

type CurrencyProps = CurrencyOwnProps & CurrencyDispatchProps & CurrencyStateProps & WrappedComponentProps;

const currencyTokenID = 'cost_currency_token';
const currencyUnitsID = 'cost_currency_units';

class CurrencyBase extends React.Component<CurrencyProps> {
  protected defaultState: CurrencyState = {
    currentItem: 'USD',
    isCurrencyOpen: false,
  };
  public state: CurrencyState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchCurrency } = this.props;

    fetchCurrency();
  }

  private getOptions = () => {
    const { currency } = this.props;

    const options: CurrencyOptions[] = [];

    if (currency) {
      currency.data.map(val => {
        options.push({
          label: messages.CurrencyOptions,
          value: val.code,
        });
      });
    }
    return options;
  };

  private getDropDownItems = () => {
    const { intl } = this.props;

    const options = this.getOptions();
    return options.map(option => (
      <DropdownItem component="button" key={option.value} onClick={() => this.handleClick(option.value)}>
        {intl.formatMessage(option.label, { units: option.value })}
      </DropdownItem>
    ));
  };

  private getCurrentLabel = () => {
    const { intl } = this.props;
    const { currentItem } = this.state;

    const cookieValue = localStorage.getItem(currencyUnitsID);
    const units = cookieValue ? cookieValue : currentItem;

    return intl.formatMessage(messages.CurrencyOptions, { units });
  };

  private getDropDown = () => {
    const { isDisabled } = this.props;
    const { isCurrencyOpen } = this.state;
    const dropdownItems = this.getDropDownItems();

    return (
      <Dropdown
        id="currencyDropdown"
        onSelect={this.handleSelect}
        toggle={
          <DropdownToggle isDisabled={isDisabled} onToggle={this.handleToggle}>
            {this.getCurrentLabel()}
          </DropdownToggle>
        }
        isOpen={isCurrencyOpen}
        dropdownItems={dropdownItems}
      />
    );
  };

  private handleClick = value => {
    localStorage.setItem(currencyUnitsID, value);
    localStorage.setItem(currencyTokenID, getTokenCookie());
    this.setState({ currentItem: value });
  };

  private handleSelect = () => {
    this.setState({
      isCurrencyOpen: !this.state.isCurrencyOpen,
    });
  };

  private handleToggle = isCurrencyOpen => {
    this.setState({
      isCurrencyOpen,
    });
  };

  private resetCurrency = () => {
    if (localStorage.getItem(currencyTokenID) !== getTokenCookie()) {
      localStorage.removeItem(currencyUnitsID);
      localStorage.removeItem(currencyTokenID);
    }
  };

  public render() {
    const { intl } = this.props;

    this.resetCurrency();

    return (
      <div style={styles.currencySelector}>
        <Title headingLevel="h2" size="md" style={styles.currencyLabel}>
          {intl.formatMessage(messages.Currency)}
        </Title>
        {this.getDropDown()}
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
