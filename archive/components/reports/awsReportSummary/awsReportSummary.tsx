import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { styles } from './awsReportSummary.styles';

interface AwsReportSummaryProps extends InjectedTranslateProps {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  title: string;
}

const AwsReportSummaryBase: React.SFC<AwsReportSummaryProps> = ({
  children,
  detailsLink,
  title,
  subTitle,
  status,
  t,
}) => (
  <Card style={styles.reportSummary}>
    <CardHeader>
      <Title size="lg">{title}</Title>
      {Boolean(subTitle) && <p style={styles.subtitle}>{subTitle}</p>}
    </CardHeader>
    <CardBody>
      {status === FetchStatus.inProgress ? (
        <>
          <Skeleton size={SkeletonSize.xs} />
          <Skeleton style={styles.chartSkeleton} size={SkeletonSize.md} />
          <Skeleton size={SkeletonSize.sm} />
          <Skeleton style={styles.legendSkeleton} size={SkeletonSize.xs} />
        </>
      ) : (
        children
      )}
    </CardBody>
    {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

const AwsReportSummary = translate()(AwsReportSummaryBase);

export { AwsReportSummary, AwsReportSummaryProps };
