import type { OcpQuery } from 'api/queries/ocpQuery';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import * as queryUtils from 'routes/utils/query';
import { getQueryState } from 'routes/utils/queryState';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { useQueryFromRoute } from 'utils/hooks';

import { styles } from './gpuData.styles';
import { MigTable } from './migTable';

interface MigDataOwnProps {
  gpu_model: string;
  gpu_vendor: string;
  node: string;
  queryStateName: string;
}

export interface MigStateProps {
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface MigMapProps {
  gpu_model: string;
  gpu_vendor: string;
  node: string;
  query?: OcpQuery;
  queryStateName: string;
}

type MigDataProps = MigDataOwnProps;

const baseQuery: OcpQuery = {
  filter: {
    resolution: 'monthly',
    time_scope_units: 'month',
  },
};

const reportPathsType = ReportPathsType.ocp;
const reportType = ReportType.mig;

const MigData: React.FC<MigDataProps> = ({ gpu_model, gpu_vendor, node, queryStateName }) => {
  const intl = useIntl();

  const [query, setQuery] = useState({ ...baseQuery });
  const { report, reportError, reportFetchStatus } = useMapToProps({
    gpu_model,
    gpu_vendor,
    node,
    query,
    queryStateName,
  });

  const getTable = () => {
    return (
      <MigTable
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        report={report}
      />
    );
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  if (reportError) {
    return <NotAvailable />;
  }
  return (
    <>
      {reportFetchStatus === FetchStatus.inProgress ? (
        <div style={styles.loading}>
          <LoadingState
            body={intl.formatMessage(messages.gpuLoadingStateDesc)}
            heading={intl.formatMessage(messages.gpuLoadingStateTitle)}
          />
        </div>
      ) : (
        report?.meta?.count > 0 && getTable()
      )}
    </>
  );
};

export const useMapToProps = ({ gpu_model, gpu_vendor, node, query, queryStateName }: MigMapProps): MigStateProps => {
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
      gpu_model,
      gpu_vendor,
      node,
      time_scope_value: timeScopeValue,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
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
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export { MigData };
