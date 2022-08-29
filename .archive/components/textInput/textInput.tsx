import { css } from '@patternfly/react-styles';
import React from 'react';
import { Omit } from 'react-redux';
import { styles } from './textInput.styles';

interface Props extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange(value: string, evt: React.FormEvent<HTMLInputElement>);
  onKeyPress?(evt: React.KeyboardEvent);
  isError?: boolean;
  isFlat?: boolean;
}

export class TextInput extends React.Component<Props> {
  private handleChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onChange(evt.currentTarget.value, evt);
  };
  private handleKeyPressed = (evt: React.KeyboardEvent) => {
    if (this.props.onKeyPress && evt.key === 'Enter') {
      evt.preventDefault();
      this.props.onKeyPress(evt);
    }
  };

  public render() {
    const { className, isFlat, isError, ...props } = this.props;
    return (
      <input
        {...props}
        className={css(
          className,
          styles.textInput,
          isFlat && styles.flat,
          isError && styles.error
        )}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPressed}
      />
    );
  }
}
