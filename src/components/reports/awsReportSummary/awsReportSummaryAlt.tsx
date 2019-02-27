import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridItem,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { styles } from './awsReportSummaryAlt.styles';

interface AwsReportSummaryAltProps extends InjectedTranslateProps {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  tabs?: React.ReactNode;
  title: string;
}

const AwsReportSummaryAltBase: React.SFC<AwsReportSummaryAltProps> = ({
  children,
  detailsLink,
  status,
  t,
  tabs,
  title,
  subTitle,
}) => (
  <Card className={css(styles.reportSummary)}>
    <Grid gutter="md">
      <GridItem lg={5} xl={6}>
        <div className={css(styles.container)}>
          <div className={css(styles.cost)}>
            <CardHeader>
              <Title size="lg">{title}</Title>
              {Boolean(subTitle) && (
                <p className={css(styles.subtitle)}>{subTitle}</p>
              )}
            </CardHeader>
            <CardBody>
              {status === FetchStatus.inProgress
                ? `${t('loading')}...`
                : children}
            </CardBody>
          </div>
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

const AwsReportSummaryAlt = translate()(AwsReportSummaryAltBase);

export { AwsReportSummaryAlt, AwsReportSummaryAltProps };
