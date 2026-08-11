import { Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';
import { setCurrency } from 'utils/sessionStorage';

import { styles } from './currency.styles';
import { getCurrencyOptions, useCurrencySettings } from './utils';

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
  currency,
  id = 'currency-select',
  isDisabled,
  isSessionStorage = true,
  onSelect,
  showLabel = true,
}) => {
  const intl = useIntl();

  const { settings } = useCurrencySettings();

  const getSelect = () => {
    const selectOptions = getCurrencyOptions(settings?.data ?? []);
    const selection = selectOptions.find(option => option.value === currency);

    return (
      <SelectWrapper
        id={id}
        isDisabled={isDisabled}
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
