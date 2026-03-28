import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { FormGroup, FormHelperText, HelperText, HelperTextItem, TextInput } from '@patternfly/react-core';
import React from 'react';

const TextField: React.FC<any> = props => {
  const {
    input,
    meta,
    label,
    isRequired,
    helperText,
    description,
    isDisabled,
    placeholder,
    validated: validatedOverride,
  } = useFieldApi(props);

  const { type, ...inputRest } = input;

  let validated: 'default' | 'error' | 'success' = 'default';
  if (validatedOverride) {
    validated = validatedOverride;
  } else if (meta.validating) {
    validated = 'default';
  } else if (meta.error && meta.touched) {
    validated = 'error';
  } else if (!meta.error && meta.dirty) {
    validated = 'success';
  }

  const displayHelperText = helperText || description;

  return (
    <FormGroup label={label} isRequired={isRequired} fieldId={input.name}>
      <TextInput
        id={input.name}
        {...inputRest}
        type={type === 'password' ? 'password' : 'text'}
        isDisabled={isDisabled}
        placeholder={placeholder}
        validated={validated}
      />
      <FormHelperText>
        <HelperText>
          {validated === 'error' && meta.error ? (
            <HelperTextItem variant="error">{meta.error}</HelperTextItem>
          ) : (
            displayHelperText && <HelperTextItem>{displayHelperText}</HelperTextItem>
          )}
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default TextField;
