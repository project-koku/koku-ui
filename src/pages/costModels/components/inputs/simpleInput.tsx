import { FormGroup, FormGroupProps, TextInput, TextInputProps } from '@patternfly/react-core';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

type SimpleInputFormGroupProps = Pick<
  FormGroupProps,
  'label' | 'style' | 'helperTextInvalid' | 'validated' | 'onBlur' | 'isRequired' | 'placeholder'
>;
type SimpleInputTextInputProps = Pick<TextInputProps, 'value' | 'onChange' | 'id'>;
type SimpleInputProps = SimpleInputTextInputProps & SimpleInputFormGroupProps;

const translateSimpleInputProps = (t: TFunction, props: SimpleInputProps) => {
  let label = props.label;
  if (typeof props.label === 'string') {
    label = t(props.label);
  }
  let helperTextInvalid = props.helperTextInvalid;
  if (typeof props.helperTextInvalid === 'string') {
    helperTextInvalid = t(props.helperTextInvalid);
  }
  return {
    ...props,
    label,
    helperTextInvalid,
  };
};

export const SimpleInput: React.FunctionComponent<SimpleInputProps> = props => {
  const { t } = useTranslation();
  const { onChange, value, id, label, style, helperTextInvalid, validated, onBlur, isRequired, placeholder } =
    translateSimpleInputProps(t, props);
  return (
    <FormGroup
      isRequired={isRequired}
      style={style}
      fieldId={id}
      label={label}
      helperTextInvalid={helperTextInvalid}
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
