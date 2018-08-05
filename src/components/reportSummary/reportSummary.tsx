import { Card, CardBody, CardHeader, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './reportSummary.styles';

interface ReportSummaryProps {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
}

const ReportSummary: React.SFC<ReportSummaryProps> = ({
  title,
  subTitle,
  children,
}) => (
  <Card className={css(styles.reportSummary)}>
    <CardHeader>
      <Title size="lg">{title}</Title>
      {Boolean(subTitle) && <p className={css(styles.subtitle)}>{subTitle}</p>}
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
);

export { ReportSummary, ReportSummaryProps };
