import { FormGroup } from 'components/formGroup';
import { TextInput } from 'components/textInput';
import React from 'react';

export interface AttributeProps {
  label: string;
  autoFocus?: boolean;
  testProps: { [key: string]: string };
  placeholder: string;
  value: string;
  error: string;
}

export interface AttributeChange {
  onChange: (value: string) => void;
}

type Props = AttributeProps & AttributeChange;

const AttributeField: React.SFC<Props> = props => (
  <FormGroup label={props.label}>
    <TextInput
      {...props.testProps}
      autoFocus={Boolean(props.autoFocus)}
      isError={Boolean(props.error)}
      isFlat
      onChange={props.onChange}
      placeholder={props.placeholder}
      value={props.value}
    />
  </FormGroup>
);

export default AttributeField;
