import { Button, ButtonProps } from '@patternfly/react-core';
import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

const CastedButton: React.SFC<
  Pick<ButtonProps, 'variant'> & LinkProps & { component: React.ReactType }
> = Button as any;

const Link: React.SFC<LinkProps> = props => (
  <CastedButton component={RouterLink} variant="link" {...props} />
);

export { Link };
