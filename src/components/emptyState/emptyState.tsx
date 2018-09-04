import { Card, CardBody, CardHeader, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './emptyState.styles';

interface EmptyStateProps {
  children?: React.ReactNode;
  subTitle?: string;
  title: string;
}

const EmptyState: React.SFC<EmptyStateProps> = ({
  children,
  subTitle,
  title,
}) => (
  <Card className={css(styles.reportSummary)}>
    <CardHeader>
      <Title size="lg">{title}</Title>
      {Boolean(subTitle) && <p className={css(styles.subtitle)}>{subTitle}</p>}
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
);

export { EmptyState, EmptyStateProps };
