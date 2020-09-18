import {
  FormGroup,
  FormGroupProps,
  FormSelect,
  FormSelectOption,
  FormSelectOptionProps,
  FormSelectProps,
} from '@patternfly/react-core';
import { TFunction } from 'i18next';
import React from 'react';
import { Translation } from 'react-i18next';

type SelectorFormGroupProps = Pick<FormGroupProps, 'helperTextInvalid' | 'label' | 'style'>;
type SelectorFormSelectProps = Pick<
  FormSelectProps,
  'isDisabled' | 'value' | 'onChange' | 'aria-label' | 'id' | 'isRequired'
>;
interface OwnProps {
  options: FormSelectOptionProps[];
  isInvalid?: boolean;
}
type SelectorProps = SelectorFormGroupProps & SelectorFormSelectProps & OwnProps;

const translateSelectorProps = (t: TFunction, props: SelectorProps): SelectorProps => {
  return {
    ...props,
    label: typeof props.label === 'string' ? t(props.label) : props.label,
    helperTextInvalid:
      typeof props.helperTextInvalid === 'string' ? t(props.helperTextInvalid) : props.helperTextInvalid,
    options: props.options.map(opt => {
      return {
        ...opt,
        label: t(opt.label),
      };
    }),
  };
};

export const Selector: React.FunctionComponent<SelectorProps> = props => {
  return (
    <Translation>
      {t => {
        const {
          'aria-label': ariaLabel,
          label,
          id,
          value,
          onChange,
          options,
          helperTextInvalid,
          isDisabled = false,
          isInvalid = false,
          isRequired = false,
          style,
        } = translateSelectorProps(t, props);
        return (
          <FormGroup
            isRequired={isRequired}
            style={style}
            label={label}
            fieldId={id}
            helperTextInvalid={helperTextInvalid}
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
                  label={opt.label}
                  isDisabled={opt.isDisabled}
                />
              ))}
            </FormSelect>
          </FormGroup>
        );
      }}
    </Translation>
  );
};
