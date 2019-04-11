import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridItem,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@red-hat-insights/insights-frontend-components/components/Skeleton';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { styles } from './ocpOnAwsReportSummaryAlt.styles';

interface OcpOnAwsReportSummaryAltProps extends InjectedTranslateProps {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  subTitleTooltip?: string;
  tabs?: React.ReactNode;
  title: string;
}

const OcpOnAwsReportSummaryAltBase: React.SFC<
  OcpOnAwsReportSummaryAltProps
> = ({
  children,
  detailsLink,
  status,
  subTitle,
  subTitleTooltip = subTitle,
  t,
  tabs,
  title,
}) => (
  <Card className={css(styles.reportSummary)}>
    <Grid gutter="md">
      <GridItem lg={5} xl={6}>
        <div className={css(styles.cost)}>
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
        </div>
      </GridItem>
      <GridItem lg={7} xl={6}>
        <div className={css(styles.container)}>
          <div className={css(styles.tops)}>
            {status !== FetchStatus.inProgress && (
              <>
                {Boolean(tabs) && <CardBody>{tabs}</CardBody>}
                {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
              </>
            )}
          </div>
        </div>
      </GridItem>
    </Grid>
  </Card>
);

const OcpOnAwsReportSummaryAlt = translate()(OcpOnAwsReportSummaryAltBase);

export { OcpOnAwsReportSummaryAlt, OcpOnAwsReportSummaryAltProps };
