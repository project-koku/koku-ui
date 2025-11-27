import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import type { TextInputProps } from '@patternfly/react-core';
import { FormGroup, HelperText, HelperTextItem, TextInput } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface SimpleInputOwnProps {
  helperTextInvalid?: MessageDescriptor | string;
  label?: MessageDescriptor | string;
}

type SimpleInputTextInputProps = Pick<
  TextInputProps,
  'onChange' | 'onBlur' | 'id' | 'isRequired' | 'placeholder' | 'style' | 'validated' | 'value'
>;
type SimpleInputProps = SimpleInputOwnProps & SimpleInputTextInputProps & WrappedComponentProps;

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
      {validated === 'error' && typeof helpText === 'object' && (
        <HelperText>
          <HelperTextItem variant="error">{intl.formatMessage(helpText)}</HelperTextItem>
        </HelperText>
      )}
    </FormGroup>
  );
};

const SimpleInput = injectIntl(SimpleInputBase);
export { SimpleInput };
