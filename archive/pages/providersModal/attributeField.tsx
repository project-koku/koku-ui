import { TextInput } from '@patternfly/react-core';
import { FormGroup } from 'components/formGroup';
import React from 'react';

export interface AttributeProps {
  label: string;
  autoFocus?: boolean;
  testProps: { [key: string]: any };
  placeholder: string;
  value: string;
  error: string;
}

export interface AttributeChange {
  onChange: (value) => void;
}

type Props = AttributeProps & AttributeChange;

const AttributeField: React.SFC<Props> = props => (
  <FormGroup label={props.label}>
    <TextInput
      aria-label={`input-${props.label}`}
      {...props.testProps}
      autoFocus={Boolean(props.autoFocus)}
      validated={!Boolean(props.error) ? 'default' : 'error'}
      onChange={props.onChange}
      placeholder={props.placeholder}
      value={props.value}
    />
  </FormGroup>
);

export default AttributeField;
