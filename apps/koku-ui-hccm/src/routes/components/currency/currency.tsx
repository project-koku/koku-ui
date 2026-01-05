import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';
import { createMapStateToProps } from 'store/common';
import { setCurrency } from 'utils/sessionStorage';

import { styles } from './currency.styles';
import { getCurrencyOptions } from './utils';

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

class CurrencyBase extends React.Component<CurrencyProps, CurrencyState> {
  protected defaultState: CurrencyState = {
    // TBD...
  };
  public state: CurrencyState = { ...this.defaultState };

  private getSelect = () => {
    const { currency, isDisabled, showLabel = true } = this.props;

    const selectOptions = getCurrencyOptions();
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
