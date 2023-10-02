import { Badge } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import { parseQuery } from 'api/queries/rosQuery';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';

export interface OptimizationsBadgeOwnProps {
  // TBD...
}

export interface OptimizationsBadgeStateProps {
  report?: RosReport;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

type OptimizationsBadgeProps = OptimizationsBadgeOwnProps & OptimizationsBadgeStateProps;

const reportPathsType = RosPathsType.recommendations;
const reportType = RosType.ros;

const OptimizationsBadge: React.FC<OptimizationsBadgeProps> = () => {
  const { report } = useMapToProps();
  const intl = useIntl();

  const count = report && report.meta ? report.meta.count : 0;

  return <Badge screenReaderText={intl.formatMessage(messages.optimizationsDetails, { count })}>{count}</Badge>;
};

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

const useMapToProps = (): OptimizationsBadgeStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();
  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  // Don't need pagination here
  const reportQuery: any = {
    ...(groupBy && {
      [groupBy]: groupByValue, // project filter
    }),
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

export { OptimizationsBadge };
