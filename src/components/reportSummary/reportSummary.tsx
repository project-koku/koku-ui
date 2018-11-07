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
import { styles } from './reportSummary.styles';

interface ReportSummaryProps extends InjectedTranslateProps {
  title: string;
  subTitle?: string;
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
}

const ReportSummaryBase: React.SFC<ReportSummaryProps> = ({
  title,
  subTitle,
  detailsLink,
  children,
  status,
  t,
}) => (
  <Card className={css(styles.reportSummary)}>
    <CardHeader className={css(styles.cardHeader)}>
      <Title size="lg">{title}</Title>
      {Boolean(subTitle) && <p className={css(styles.subtitle)}>{subTitle}</p>}
    </CardHeader>
    <CardBody className={css(styles.cardBody)}>
      {status === FetchStatus.inProgress ? `${t('loading')}...` : children}
    </CardBody>
    {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

const ReportSummary = translate()(ReportSummaryBase);

export { ReportSummary, ReportSummaryProps };
