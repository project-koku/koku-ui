import type { MessageDescriptor } from '@formatjs/intl';
import type { FormGroupProps } from '@patternfly/react-core';
import React from 'react';
import { Selector } from 'routes/settings/components';

import { getCurrencyOptions, useCurrencySettings } from './utils';

interface CurrencyWrapperOwnProps {
  appendMenuTo?: HTMLElement | (() => HTMLElement) | 'inline' | 'parent';
  'aria-label'?: string;
  direction?: 'up' | 'down';
  // Prevents selecting the same base and target currency (e.g. exchange rates)
  disabledCode?: string;
  helperTextInvalid?: MessageDescriptor | string;
  id?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  label?: MessageDescriptor | string;
  maxMenuHeight?: string;
  onSelect?: (evt: any, value: string) => void;
  placeholderText?: string;
  toggleAriaLabel?: string;
  value?: string;
}

type CurrencyWrapperProps = CurrencyWrapperOwnProps & Pick<FormGroupProps, 'style'>;

const CurrencyWrapper: React.FC<CurrencyWrapperProps> = ({
  appendMenuTo,
  'aria-label': ariaLabel,
  direction,
  disabledCode,
  helperTextInvalid,
  id = 'currency-select',
  isDisabled,
  isInvalid,
  isRequired,
  label,
  maxMenuHeight,
  onSelect,
  placeholderText,
  style,
  toggleAriaLabel,
  value,
}) => {
  const { settings } = useCurrencySettings();
  const selectOptions = getCurrencyOptions(settings?.data ?? [], disabledCode);

  return (
    <Selector
      appendMenuTo={appendMenuTo}
      aria-label={ariaLabel}
      direction={direction}
      helperTextInvalid={helperTextInvalid}
      id={id}
      isDisabled={isDisabled || selectOptions?.length === 0}
      isInvalid={isInvalid}
      isRequired={isRequired}
      label={label}
      maxMenuHeight={maxMenuHeight}
      onSelect={onSelect}
      options={selectOptions}
      placeholderText={placeholderText}
      style={style}
      toggleAriaLabel={toggleAriaLabel}
      value={value}
    />
  );
};

export default CurrencyWrapper;
