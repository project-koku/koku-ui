import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './reportSummary.styles';

interface ReportSummaryProps {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
}

const ReportSummary: React.SFC<ReportSummaryProps> = ({
  title,
  subTitle,
  detailsLink,
  children,
}) => (
  <Card className={css(styles.reportSummary)}>
    <CardHeader>
      <Title size="lg">{title}</Title>
      {Boolean(subTitle) && <p className={css(styles.subtitle)}>{subTitle}</p>}
    </CardHeader>
    <CardBody>{children}</CardBody>
    {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

export { ReportSummary, ReportSummaryProps };
