import { css } from '@patternfly/react-styles';
import React from 'react';
import { Omit } from 'react-redux';
import { styles } from './textInput.styles';

interface Props extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange(value: string, evt: React.FormEvent<HTMLInputElement>);
  isFlat?: boolean;
}

export class TextInput extends React.Component<Props> {
  private handleChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onChange(evt.currentTarget.value, evt);
  };

  public render() {
    const { className, isFlat, ...props } = this.props;
    return (
      <input
        {...props}
        className={css(className, styles.textInput, isFlat && styles.flat)}
        onChange={this.handleChange}
      />
    );
  }
}
