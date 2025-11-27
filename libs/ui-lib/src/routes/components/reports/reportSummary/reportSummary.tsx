import './reportSummary.scss';

import { Card, CardBody, CardFooter, CardTitle, Skeleton, Title, TitleSizes } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { FetchStatus } from '../../../../store/common';
import { skeletonWidth } from '../../../utils/skeleton';

export interface ReportSummaryProps extends WrappedComponentProps {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  title: string;
}

const ReportSummaryBase: React.FC<ReportSummaryProps> = ({ children, detailsLink, title, subTitle, status }) => (
  <Card className="reportSummary">
    <CardTitle>
      <Title headingLevel="h2" size={TitleSizes.lg}>
        {title}
      </Title>
      {subTitle && <p className="subtitle">{subTitle}</p>}
    </CardTitle>
    <CardBody>
      {status === FetchStatus.inProgress ? (
        <>
          <Skeleton width="16%" />
          <Skeleton className="chartSkeleton" width={skeletonWidth.md} />
          <Skeleton width="33%" />
          <Skeleton className="legendSkeleton" width={skeletonWidth.xs} />
        </>
      ) : (
        children
      )}
    </CardBody>
    {detailsLink && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

const ReportSummary = injectIntl(ReportSummaryBase);

export default ReportSummary;
