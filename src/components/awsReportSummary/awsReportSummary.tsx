import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from '../../store/common';
import { styles } from './awsReportSummary.styles';

interface AwsReportSummaryProps extends InjectedTranslateProps {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
}

const AwsReportSummaryBase: React.SFC<AwsReportSummaryProps> = ({
  title,
  subTitle,
  detailsLink,
  children,
  status,
  t,
}) => (
  <Card className={css(styles.reportSummary)}>
    <CardHeader>
      <Title size="lg">{title}</Title>
      {Boolean(subTitle) && <p className={css(styles.subtitle)}>{subTitle}</p>}
    </CardHeader>
    <CardBody>
      {status === FetchStatus.inProgress ? `${t('loading')}...` : children}
    </CardBody>
    {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

const AwsReportSummary = translate()(AwsReportSummaryBase);

export { AwsReportSummary, AwsReportSummaryProps };
