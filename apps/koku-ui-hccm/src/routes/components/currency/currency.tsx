import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';
import { FetchStatus } from 'store/common';
import { getCurrency, setCurrency } from 'utils/sessionStorage';

import { styles } from './currency.styles';
import { getCurrencyOptions, resolveEnabledCurrency, useCurrency } from './utils';

interface CurrencyOwnProps {
  currency?: string;
  id?: string;
  isDisabled?: boolean;
  isSessionStorage?: boolean;
  onSelect?: (value: string) => void;
  showLabel?: boolean;
}

type CurrencyProps = CurrencyOwnProps;

const Currency: React.FC<CurrencyProps> = ({
  currency: currencyValue,
  id = 'currency-select',
  isDisabled,
  isSessionStorage = true,
  onSelect,
  showLabel = true,
}) => {
  const intl = useIntl();

  const { currency, currencyFetchStatus } = useCurrency();

  const getSelect = () => {
    const isEmpty = !currency?.data?.length;
    const selectOptions = getCurrencyOptions(currency?.data?.length ? currency.data : [{ code: 'USD' }]);
    const selection = selectOptions.find(option => option.value === currencyValue);

    return (
      <SelectWrapper
        id={id}
        isDisabled={isDisabled || isEmpty}
        onSelect={handleOnSelect}
        options={selectOptions}
        position={showLabel ? 'right' : undefined}
        selection={selection}
      />
    );
  };

  const handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    // Set currency units via local storage
    if (isSessionStorage) {
      setCurrency(selection.value);
    }
    if (onSelect) {
      onSelect(selection.value);
    }
  };

  // Effects

  // Reset session currency when the stored selection is no longer enabled
  useEffect(() => {
    if (!isSessionStorage || currencyFetchStatus !== FetchStatus.complete || !currency?.data?.length) {
      return;
    }

    const enabledCodes = currency.data.map(item => item.code);
    const resolved = resolveEnabledCurrency(enabledCodes);
    if (resolved !== getCurrency()) {
      setCurrency(resolved);
      onSelect?.(resolved);
    }
  }, [currency?.data, currencyFetchStatus, isSessionStorage, onSelect]);

  return (
    <div style={styles.currencySelector}>
      {showLabel && (
        <Title headingLevel="h2" size={TitleSizes.md} style={styles.currencyLabel}>
          {intl.formatMessage(messages.currency)}
        </Title>
      )}
      {getSelect()}
    </div>
  );
};

export default Currency;
