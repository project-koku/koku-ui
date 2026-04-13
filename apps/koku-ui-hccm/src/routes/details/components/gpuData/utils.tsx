import type { OcpQuery } from 'api/queries/ocpQuery';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { OcpReport } from 'api/reports/ocpReports';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import { useIsMigToggleEnabled } from 'components/featureToggle';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { getQueryState } from 'routes/utils/queryState';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { useQueryFromRoute } from 'utils/hooks';
import { platformCategoryKey } from 'utils/props';

export interface GpuStateProps {
  isMigToggleEnabled?: boolean;
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface GpuMapProps {
  query: OcpQuery;
  queryStateName: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

export const useMapToProps = ({ query, queryStateName, reportPathsType, reportType }: GpuMapProps): GpuStateProps => {
  const location = useLocation();
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const queryFromRoute = useQueryFromRoute();
  const queryState = getQueryState(location, queryStateName);

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  const isFilterByExact = groupBy && groupByValue !== '*';
  const timeScopeValue = getTimeScopeValue(queryState);

  const reportQuery: Query = {
    filter: {
      ...query.filter,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: timeScopeValue,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
      // Omit filters associated with the current group_by -- see https://redhat.atlassian.net/browse/COST-1131 and https://redhat.atlassian.net/browse/COST-3642
      // Note: We're not inserting PVC information for the 'Platform' project
      ...(isFilterByExact && {
        [groupBy]: undefined, // Replace with "exact:" filter below -- see https://redhat.atlassian.net/browse/COST-6659
        [`exact:${groupBy}`]: groupByValue,
      }),
      ...query.filter_by,
    },
    exclude: {
      ...(queryState?.exclude && queryState.exclude),
    },
    group_by: {
      gpu_name: '*',
    },
    order_by: query.order_by,
  };

  const reportQueryString = getQuery(reportQuery);
  const report = useSelector((state: RootState) =>
    reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString)
  );
  const reportFetchStatus = useSelector((state: RootState) =>
    reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, reportQueryString)
  );
  const reportError = useSelector((state: RootState) =>
    reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString)
  );

  useEffect(() => {
    if (!reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(reportActions.fetchReport(reportPathsType, reportType, reportQueryString));
    }
  }, [dispatch, reportError, reportFetchStatus, reportPathsType, reportQueryString, reportType]);

  return {
    isMigToggleEnabled: useIsMigToggleEnabled(),
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};
