import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './backdrop.styles';

type Props = React.HTMLProps<HTMLDivElement>;

export const Backdrop: React.SFC<Props> = ({ className, ...props }) => (
  <div className={css(styles.backdrop, className)} {...props} />
);

Backdrop.defaultProps = {
  className: '',
  onClick: null,
};
