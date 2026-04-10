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
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import * as queryUtils from 'routes/utils/query';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { useQueryState } from 'utils/hooks';

import { styles } from './gpuData.styles';
import { MigTable } from './migTable';

interface MigDataOwnProps {
  gpu_model: string;
  gpu_vendor: string;
  node: string;
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

const MigData: React.FC<MigDataProps> = ({ gpu_model, gpu_vendor, node }) => {
  const intl = useIntl();

  const [query, setQuery] = useState({ ...baseQuery });
  const { report, reportError, reportFetchStatus } = useMapToProps({
    gpu_model,
    gpu_vendor,
    node,
    query,
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

export const useMapToProps = ({ gpu_model, gpu_vendor, node, query }: MigMapProps): MigStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryState = useQueryState();

  // const isFilterByExact = groupBy && groupByValue !== '*';
  const timeScopeValue = getTimeScopeValue(queryState);

  const reportQuery: Query = {
    filter: {
      ...query.filter,
      gpu_model,
      gpu_vendor,
      node,
      time_scope_value: timeScopeValue,
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
