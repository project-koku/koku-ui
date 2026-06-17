import { NumberInput } from '@patternfly/react-core';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

interface CustomDateRangeOwnProps {
  inputValue?: number;
  isDisabled?: boolean;
  onUpdate?: (value: number) => void;
}

type CustomDateRangeProps = CustomDateRangeOwnProps;

const CustomDateRange: React.FC<CustomDateRangeProps> = ({ isDisabled, onUpdate, inputValue }) => {
  const intl = useIntl();

  const maxValue = 120;
  const minValue = 3;

  const [retentionPeriod, setRetentionPeriod] = useState<number | ''>(inputValue);

  const normalizeBetween = (value: number, min: number, max: number): number => {
    if (min !== undefined && max !== undefined) {
      return Math.max(Math.min(value, max), min);
    } else if (value <= min) {
      return min;
    } else if (value >= max) {
      return max;
    }
    return value;
  };

  // Handlers

  const handleOnMinus = () => {
    const newValue = normalizeBetween((retentionPeriod as number) - 1, minValue, maxValue);
    setRetentionPeriod(newValue);
    onUpdate?.(newValue);
  };

  const handleOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    const targetValue = (event.target as HTMLInputElement).value;
    setRetentionPeriod(targetValue === '' ? '' : +targetValue);
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const targetValue = +event.target.value;
    const clampedValue = isNaN(targetValue) ? minValue : normalizeBetween(targetValue, minValue, maxValue);
    setRetentionPeriod(clampedValue);
    onUpdate(clampedValue);
  };

  const handleOnPlus = () => {
    const newValue = normalizeBetween((retentionPeriod as number) + 1, minValue, maxValue);
    setRetentionPeriod(newValue);
    onUpdate(newValue);
  };

  return (
    <NumberInput
      inputAriaLabel={intl.formatMessage(messages.dataRetentionInputAriaLabel)}
      inputName="data-retention-period"
      isDisabled={isDisabled}
      max={maxValue}
      min={minValue}
      minusBtnAriaLabel={intl.formatMessage(messages.dataRetentionMinusBtnAriaLabel)}
      onMinus={handleOnMinus}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      onPlus={handleOnPlus}
      plusBtnAriaLabel={intl.formatMessage(messages.dataRetentionPlusBtnAriaLabel)}
      value={retentionPeriod}
      unit={intl.formatMessage(messages.months)}
    />
  );
};

export { CustomDateRange };
