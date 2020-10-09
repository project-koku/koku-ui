import './reportSummary.scss';

import { Card, CardBody, CardFooter, CardTitle, Title } from '@patternfly/react-core';
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FetchStatus } from 'store/common';

interface ReportSummaryProps extends WithTranslation {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  title: string;
}

const ReportSummaryBase: React.SFC<ReportSummaryProps> = ({ children, detailsLink, title, subTitle, status }) => (
  <Card className="reportSummary">
    <CardTitle>
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      {Boolean(subTitle) && <p className="subtitle">{subTitle}</p>}
    </CardTitle>
    <CardBody>
      {status === FetchStatus.inProgress ? (
        <>
          <Skeleton size="xs" />
          <Skeleton className="chartSkeleton" size="md" />
          <Skeleton size="sm" />
          <Skeleton className="legendSkeleton" size="xs" />
        </>
      ) : (
        children
      )}
    </CardBody>
    {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

const ReportSummary = withTranslation()(ReportSummaryBase);

export { ReportSummary, ReportSummaryProps };
