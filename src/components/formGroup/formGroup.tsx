import { css } from '@patternfly/react-styles';
import { RandomId } from 'components/randomId';
import React from 'react';
import { styles } from './formGroup.styles';

interface Props {
  label: string;
  children?: React.ReactElement<any>;
}

export const FormGroup: React.SFC<Props> = ({ label, children }) => (
  <RandomId prefix={label}>
    {({ id }) => (
      <div className={css(styles.formGroup)}>
        <label className={css(styles.label)} htmlFor={id}>
          {label}
        </label>
        <div>{React.cloneElement(React.Children.only(children), { id })}</div>
      </div>
    )}
  </RandomId>
);
