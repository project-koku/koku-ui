import type { MessageDescriptor } from '@formatjs/intl';
import type { TextAreaProps } from '@patternfly/react-core';
import { FormGroup, HelperText, HelperTextItem, TextArea } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface SimpleAreaOwnProps {
  helperTextInvalid?: MessageDescriptor | string;
  label?: MessageDescriptor | string;
}

type SimpleInputTextAreaProps = Pick<
  TextAreaProps,
  'aria-label' | 'onChange' | 'onBlur' | 'id' | 'isRequired' | 'placeholder' | 'style' | 'validated' | 'value'
>;
type SimpleAreaProps = SimpleAreaOwnProps & SimpleInputTextAreaProps & WrappedComponentProps;

const SimpleAreaBase: React.FC<SimpleAreaProps> = ({
  'aria-label': ariaLabel,
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
      <TextArea
        aria-label={ariaLabel}
        validated={validated}
        value={value ?? ''}
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

const SimpleArea = injectIntl(SimpleAreaBase);
export { SimpleArea };
