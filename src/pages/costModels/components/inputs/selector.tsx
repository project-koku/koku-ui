import { MessageDescriptor } from '@formatjs/intl/src/types';
import { FormGroup, FormGroupProps, FormSelect, FormSelectOption, FormSelectProps } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface SelectorFormGroupOwnProps {
  helperTextInvalid?: MessageDescriptor | string;
  isInvalid?: boolean;
  label?: MessageDescriptor | string;
  options: {
    isDisabled?: boolean;
    label: MessageDescriptor | string;
    value: any;
  }[];
}

type SelectorFormGroupProps = Pick<FormGroupProps, 'style'>;
type SelectorFormSelectProps = Pick<
  FormSelectProps,
  'isDisabled' | 'value' | 'onChange' | 'aria-label' | 'id' | 'isRequired'
>;

type SelectorProps = SelectorFormGroupOwnProps &
  SelectorFormGroupProps &
  SelectorFormSelectProps &
  WrappedComponentProps;

const SelectorBase: React.FunctionComponent<SelectorProps> = ({
  'aria-label': ariaLabel,
  helperTextInvalid: helpText,
  id,
  intl = defaultIntl, // Default required for testing
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  label,
  onChange,
  options,
  style,
  value,
}) => {
  return (
    <FormGroup
      isRequired={isRequired}
      style={style}
      fieldId={id}
      label={label !== null && typeof label === 'object' ? intl.formatMessage(label) : label}
      helperTextInvalid={helpText !== null && typeof helpText === 'object' ? intl.formatMessage(helpText) : helpText}
      validated={isInvalid ? 'error' : 'default'}
    >
      <FormSelect
        isRequired={isRequired}
        isDisabled={isDisabled}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        id={id}
        validated={isInvalid ? 'error' : 'default'}
      >
        {options.map(opt => (
          <FormSelectOption
            key={`${opt.value}`}
            value={opt.value}
            label={typeof opt.label === 'object' ? intl.formatMessage(opt.label) : opt.label}
            isDisabled={opt.isDisabled}
          />
        ))}
      </FormSelect>
    </FormGroup>
  );
};

const Selector = injectIntl(SelectorBase);
export { Selector };
