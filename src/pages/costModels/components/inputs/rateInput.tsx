import {
  FormGroup,
  FormGroupProps,
  InputGroup,
  InputGroupText,
  TextInput,
  TextInputProps,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons/dist/js/icons/dollar-sign-icon';
import React from 'react';
import { useTranslation } from 'react-i18next';

type RateFormGroup = Pick<FormGroupProps, 'fieldId' | 'style'>;
interface UniqueProps {
  label?: string;
  helperTextInvalid?: string;
}
type RateTextInput = Pick<TextInputProps, 'value' | 'onChange' | 'validated' | 'onBlur'>;
type RateInputBaseProps = RateFormGroup & RateTextInput & UniqueProps;

export const RateInputBase: React.FunctionComponent<RateInputBaseProps> = ({
  fieldId,
  label = 'cost_models.rate',
  helperTextInvalid = 'cost_models.add_rate_form.error_message',
  style,
  validated,
  value,
  onChange,
  onBlur,
}) => {
  const { t } = useTranslation();
  const invalidTextI18n = t(helperTextInvalid);
  const labelI18n = t(label);
  return (
    <FormGroup
      isRequired
      style={style}
      label={labelI18n}
      fieldId={fieldId}
      helperTextInvalid={invalidTextI18n}
      validated={validated}
    >
      <InputGroup>
        <InputGroupText>
          <DollarSignIcon />
        </InputGroupText>
        <TextInput
          onBlur={onBlur}
          isRequired
          type="text"
          aria-label={`rate input ${fieldId}`}
          id={fieldId}
          placeholder="0.00"
          value={value}
          onChange={onChange}
          validated={validated}
        />
      </InputGroup>
    </FormGroup>
  );
};
