import { Card, CardBody, CardHeader, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './reportSummary.styles';

interface ReportSummaryProps {
  title: string;
  children?: React.ReactNode;
}

const ReportSummary: React.SFC<ReportSummaryProps> = ({ title, children }) => (
  <Card className={css(styles.reportSummary)}>
    <CardHeader>
      <Title size="lg">{title}</Title>
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
);

export { ReportSummary, ReportSummaryProps };
