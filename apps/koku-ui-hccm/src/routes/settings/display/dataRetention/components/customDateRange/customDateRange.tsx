import { NumberInput } from '@patternfly/react-core';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { noop } from 'routes/utils/noop';

interface CustomDateRangeOwnProps {
  inputValue?: number;
  isDisabled?: boolean;
  onUpdate?: (value: number) => void;
}

type CustomDateRangeProps = CustomDateRangeOwnProps;

// Delay matches resourceFetch -- https://redhat.atlassian.net/browse/COST-1742
const UPDATE_DELAY_MS = 625;

const CustomDateRange: React.FC<CustomDateRangeProps> = ({ isDisabled, onUpdate, inputValue }) => {
  const intl = useIntl();

  const maxValue = 120;
  const minValue = 3;

  const [retentionPeriod, setRetentionPeriod] = useState<number | ''>(inputValue);
  const [updateTimeout, setUpdateTimeout] = useState(noop);

  const normalizeBetween = (value: number, min: number, max: number): number => {
    return Math.max(Math.min(value, max), min);
  };

  const scheduleUpdate = (value: number) => {
    clearTimeout(updateTimeout);

    // Delay API update until the user stops clicking +/- buttons
    setUpdateTimeout(
      setTimeout(() => {
        onUpdate?.(value);
      }, UPDATE_DELAY_MS)
    );
  };

  // Handlers

  const handleOnMinus = () => {
    const current = typeof retentionPeriod === 'number' && !isNaN(retentionPeriod) ? retentionPeriod : minValue;
    const newValue = normalizeBetween(current - 1, minValue, maxValue);
    setRetentionPeriod(newValue);
    scheduleUpdate(newValue);
  };

  const handleOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    const targetValue = (event.target as HTMLInputElement).value;
    setRetentionPeriod(targetValue === '' ? '' : +targetValue);
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    clearTimeout(updateTimeout);
    const targetValue = +event.target.value;
    const clampedValue = isNaN(targetValue) ? minValue : normalizeBetween(targetValue, minValue, maxValue);
    setRetentionPeriod(clampedValue);
    onUpdate?.(clampedValue);
  };

  const handleOnPlus = () => {
    const current = typeof retentionPeriod === 'number' && !isNaN(retentionPeriod) ? retentionPeriod : minValue;
    const newValue = normalizeBetween(current + 1, minValue, maxValue);
    setRetentionPeriod(newValue);
    scheduleUpdate(newValue);
  };

  // Effects

  useEffect(() => {
    if (inputValue !== undefined) {
      setRetentionPeriod(inputValue);
    }
  }, [inputValue]);

  useEffect(() => {
    return () => {
      clearTimeout(updateTimeout);
    };
  }, [updateTimeout]);

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
