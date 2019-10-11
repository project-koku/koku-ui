import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Title,
  Tooltip,
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
  subTitleTooltip?: string;
  title: string;
}

const AwsReportSummaryBase: React.SFC<AwsReportSummaryProps> = ({
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
      {status === FetchStatus.inProgress ? (
        <>
          <Skeleton size={SkeletonSize.xs} />
          <Skeleton
            className={css(styles.chartSkeleton)}
            size={SkeletonSize.md}
          />
          <Skeleton size={SkeletonSize.sm} />
          <Skeleton
            className={css(styles.legendSkeleton)}
            size={SkeletonSize.xs}
          />
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
