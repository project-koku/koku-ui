import { MessageDescriptor } from '@formatjs/intl/src/types';
import { FormGroup, FormGroupProps, FormSelectProps, Select, SelectVariant, SelectOption } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import React, { useEffect, useState } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface SelectorFormGroupOwnProps {
  helperTextInvalid?: MessageDescriptor | string;
  isInvalid?: boolean;
  label?: MessageDescriptor | string;
  placeholder?: string;
  options: {
    isDisabled?: boolean;
    label: MessageDescriptor | string;
    value: any;
    description?: string;
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
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  useEffect(() => {
    if(selection === null || options.some(o => formatLabel(o) === selection)) { //TODO: move to rateForm
      return;
    }
    setSelection(null);
    onChange(null, null);
  }, [options]);

  const formatLabel = (opt: any) => 
    typeof opt.label === 'object' ? intl.formatMessage(opt.label) : opt.label;

  const getOptionValueFromLabel = (label: string) => 
    options.find(o => label === formatLabel(o))?.value;

  return (
    <FormGroup
      isRequired={isRequired}
      style={style}
      fieldId={id}
      label={label !== null && typeof label === 'object' ? intl.formatMessage(label) : label}
      helperTextInvalid={helpText !== null && typeof helpText === 'object' ? intl.formatMessage(helpText) : helpText}
      validated={isInvalid ? 'error' : 'default'}
    >
      <Select
        variant={SelectVariant.single}
        aria-label={ariaLabel}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        onSelect={(e, sel) => {
          setSelection(sel);
          onChange(getOptionValueFromLabel(sel.toString()), null); // TODO: selectOptionObject
          setIsOpen(false);
        }}
        selections={selection}
      >
        {options.map(opt => (
          <SelectOption
            key={`${opt.value}`}
            value={formatLabel(opt)}
            description={opt.description}
            isDisabled={opt.isDisabled}
            isPlaceholder={false}
          />
        ))}    
      </Select>
    </FormGroup>
  );
};

const Selector = injectIntl(SelectorBase);
export { Selector };
