import type { MessageDescriptor } from '@formatjs/intl/src/types';
import type { FormGroupProps, TextInputProps } from '@patternfly/react-core';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface SimpleInputOwnProps {
  helperTextInvalid?: MessageDescriptor | string;
  label?: MessageDescriptor | string;
}

type SimpleInputFormGroupProps = Pick<FormGroupProps, 'onBlur' | 'isRequired' | 'placeholder' | 'style' | 'validated'>;
type SimpleInputTextInputProps = Pick<TextInputProps, 'id' | 'onChange' | 'value'>;
type SimpleInputProps = SimpleInputOwnProps &
  SimpleInputTextInputProps &
  SimpleInputFormGroupProps &
  WrappedComponentProps;

const SimpleInputBase: React.FC<SimpleInputProps> = ({
  id,
  intl = defaultIntl, // Default required for testing
  label,
  isRequired,
  helperTextInvalid: helpText,
  onChange,
  onBlur,
  placeholder,
  style,
  validated,
  value,
}) => {
  return (
    <FormGroup
      isRequired={isRequired}
      style={style}
      fieldId={id}
      label={label !== null && typeof label === 'object' ? intl.formatMessage(label) : (label as string)}
      helperTextInvalid={
        helpText !== null && typeof helpText === 'object' ? intl.formatMessage(helpText) : (helpText as string)
      }
      validated={validated}
    >
      <TextInput
        validated={validated}
        value={value}
        onChange={onChange}
        id={id}
        onBlur={onBlur}
        isRequired={isRequired}
        placeholder={placeholder}
      />
    </FormGroup>
  );
};

const SimpleInput = injectIntl(SimpleInputBase);
export { SimpleInput };
