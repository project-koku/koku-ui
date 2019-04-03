import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { styles } from './ocpOnAwsReportSummary.styles';

interface OcpOnAwsReportSummaryProps extends InjectedTranslateProps {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  subTitleTooltip?: string;
  title: string;
}

const OcpOnAwsReportSummaryBase: React.SFC<OcpOnAwsReportSummaryProps> = ({
  children,
  detailsLink,
  title,
  subTitle,
  subTitleTooltip = subTitle,
  status,
  t,
}) => (
  <Card className={css(styles.reportSummary)}>
    <CardHeader>
      <Title size="lg">{title}</Title>
      {Boolean(subTitle) && (
        <Tooltip content={subTitleTooltip} enableFlip>
          <p className={css(styles.subtitle)}>{subTitle}</p>
        </Tooltip>
      )}
    </CardHeader>
    <CardBody>
      {status === FetchStatus.inProgress ? `${t('loading')}...` : children}
    </CardBody>
    {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

const OcpOnAwsReportSummary = translate()(OcpOnAwsReportSummaryBase);

export { OcpOnAwsReportSummary, OcpOnAwsReportSummaryProps };
