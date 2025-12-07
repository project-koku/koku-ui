import type { MessageDescriptor } from '@formatjs/intl/src/types';
import type { FormGroupProps } from '@patternfly/react-core';
import { FormGroup, HelperText, HelperTextItem } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import React, { useEffect, useState } from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';

interface SelectorFormGroupOwnProps {
  helperTextInvalid?: MessageDescriptor | string;
  isInvalid?: boolean;
  label?: MessageDescriptor | string;
  appendMenuTo?: HTMLElement | (() => HTMLElement) | 'inline' | 'parent';
  toggleAriaLabel?: string;
  maxMenuHeight?: string;
  placeholderText?: string;
  direction?: 'up' | 'down';
  options: {
    description?: string;
    label: MessageDescriptor | string;
    value: any;
  }[];
}

type SelectorFormGroupProps = Pick<FormGroupProps, 'style'>;
interface SelectorFormSelectProps {
  'aria-label'?: string;
  id: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  onSelect?: (evt: any, value: string) => void;
  value?: string;
}

type SelectorProps = SelectorFormGroupOwnProps &
  SelectorFormGroupProps &
  SelectorFormSelectProps &
  WrappedComponentProps;

const SelectorBase: React.FC<SelectorProps> = ({
  appendMenuTo,
  'aria-label': ariaLabel,
  direction = 'down',
  helperTextInvalid: helpText,
  id,
  intl = defaultIntl, // Default required for testing
  isInvalid = false,
  isRequired = false,
  label,
  maxMenuHeight,
  onSelect,
  options,
  placeholderText,
  toggleAriaLabel,
  value,

  style,
}) => {
  const [selection, setSelection] = useState<SelectWrapperOption>(null);

  useEffect(() => {
    if (!value || value.length === 0) {
      setSelection(null);
    } else {
      setSelection(value);
    }
  }, [value]);

  const getSelectOptions = (): SelectWrapperOption[] => {
    const selectOptions = options.map(option => {
      return {
        description: option.description,
        toString: () => (typeof option.label === 'object' ? intl.formatMessage(option.label) : option.label),
        value: option.value,
      };
    });
    return selectOptions.sort((a, b) => (a?.toString() ?? '').localeCompare(b?.toString() ?? ''));
  };

  const handleOnSelect = (_evt, sel: SelectWrapperOption) => {
    setSelection(sel);
    onSelect(null, sel.value);
  };

  return (
    <FormGroup
      isRequired={isRequired}
      style={style}
      fieldId={id}
      label={label !== null && typeof label === 'object' ? intl.formatMessage(label) : (label as string)}
    >
      <SelectWrapper
        appendTo={appendMenuTo}
        ariaLabel={ariaLabel}
        direction={direction}
        id={id}
        maxMenuHeight={maxMenuHeight}
        onSelect={handleOnSelect}
        options={getSelectOptions()}
        placeholder={placeholderText}
        selection={selection}
        status={isInvalid ? 'danger' : undefined}
        toggleAriaLabel={toggleAriaLabel}
      />
      {isInvalid && typeof helpText === 'object' && (
        <HelperText>
          <HelperTextItem variant="error">{intl.formatMessage(helpText)}</HelperTextItem>
        </HelperText>
      )}
    </FormGroup>
  );
};

const Selector = injectIntl(SelectorBase);
export { Selector };
