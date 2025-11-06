import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardTitle,
  Popover,
  Skeleton,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { getQuery } from 'api/queries/query';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { skeletonWidth } from 'routes/utils/skeleton';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';

import { styles } from './optimizations.styles';

export interface OptimizationsSummaryOwnProps {
  linkPath?: string;
  linkState?: any;
}

export interface OptimizationsSummaryStateProps {
  report?: RosReport;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

type OptimizationsSummaryProps = OptimizationsSummaryOwnProps & OptimizationsSummaryStateProps;

const reportPathsType = RosPathsType.recommendations;
const reportType = RosType.ros;

const OptimizationsSummary: React.FC<OptimizationsSummaryProps> = ({
  linkPath,
  linkState,
}: OptimizationsSummaryOwnProps) => {
  const intl = useIntl();
  const { report, reportFetchStatus } = useMapToProps();

  const count = report?.meta ? report.meta.count : 0;
  const description = intl.formatMessage(messages.optimizationsDetails, { count });

  return (
    <Card className="summary">
      <CardTitle>
        <Title headingLevel="h2" size={TitleSizes.lg}>
          {intl.formatMessage(messages.optimizations)}
          <span style={styles.infoIcon}>
            <Popover
              aria-label={intl.formatMessage(messages.optimizationsInfoArialLabel)}
              enableFlip
              bodyContent={
                <>
                  <p>{intl.formatMessage(messages.optimizationsInfoTitle)}</p>
                  <br />
                  <p>
                    {intl.formatMessage(messages.optimizationsInfoDesc, {
                      learnMore: (
                        <a href={intl.formatMessage(messages.docsOptimizations)} rel="noreferrer" target="_blank">
                          {intl.formatMessage(messages.learnMore)}
                        </a>
                      ),
                    })}
                  </p>
                </>
              }
            >
              <Button
                icon={<OutlinedQuestionCircleIcon />}
                aria-label={intl.formatMessage(messages.optimizationsInfoButtonArialLabel)}
                variant={ButtonVariant.plain}
              />
            </Popover>
          </span>
        </Title>
      </CardTitle>
      <CardBody>
        {reportFetchStatus === FetchStatus.inProgress ? (
          <>
            <Skeleton width="16%" />
            <Skeleton className="skeleton" width={skeletonWidth.md} />
          </>
        ) : linkPath && count > 0 ? (
          <Link to={linkPath} state={{ ...linkState }}>
            {description}
          </Link>
        ) : (
          description
        )}
      </CardBody>
    </Card>
  );
};

const useMapToProps = (): OptimizationsSummaryStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const reportQuery: any = {
    // TBD...
  };
  const reportQueryString = getQuery(reportQuery);
  const report: any = useSelector((state: RootState) =>
    rosSelectors.selectRos(state, reportPathsType, reportType, reportQueryString)
  );
  const reportFetchStatus = useSelector((state: RootState) =>
    rosSelectors.selectRosFetchStatus(state, reportPathsType, reportType, reportQueryString)
  );
  const reportError = useSelector((state: RootState) =>
    rosSelectors.selectRosError(state, reportPathsType, reportType, reportQueryString)
  );

  useEffect(() => {
    if (!reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(rosActions.fetchRosReport(reportPathsType, reportType, reportQueryString));
    }
  }, [reportQueryString]);

  return {
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export { OptimizationsSummary };
