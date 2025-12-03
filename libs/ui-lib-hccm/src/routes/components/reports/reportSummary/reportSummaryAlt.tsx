import './reportSummaryAlt.scss';

import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Grid,
  GridItem,
  Skeleton,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { FetchStatus } from '../../../../store/common';
import { skeletonWidth } from '../../../utils/skeleton';

export interface ReportSummaryAltAltProps extends WrappedComponentProps {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  tabs?: React.ReactNode;
  title: string;
}

const ReportSummaryAltBase: React.FC<ReportSummaryAltAltProps> = ({
  children,
  detailsLink,
  status,
  subTitle,
  tabs,
  title,
}) => (
  <Card className="reportSummary">
    <Grid hasGutter>
      <GridItem xl={8}>
        <div className="cost">
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
        </div>
      </GridItem>
      <GridItem xl={4}>
        <div className="tops">
          {status !== FetchStatus.inProgress && (
            <>
              {tabs && <CardBody>{tabs}</CardBody>}
              {detailsLink && <CardFooter>{detailsLink}</CardFooter>}
            </>
          )}
        </div>
      </GridItem>
    </Grid>
  </Card>
);

const ReportSummaryAlt = injectIntl(ReportSummaryAltBase);

export default ReportSummaryAlt;
