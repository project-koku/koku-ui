import { Card, CardBody, CardHeader, Title } from '@patternfly/react-core';
import React from 'react';

interface ReportSummaryProps {
  title: string;
  children?: React.ReactNode;
}

const ReportSummary: React.SFC<ReportSummaryProps> = ({ title, children }) => (
  <Card>
    <CardHeader>
      <Title size="lg">{title}</Title>
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
);

export { ReportSummary, ReportSummaryProps };
