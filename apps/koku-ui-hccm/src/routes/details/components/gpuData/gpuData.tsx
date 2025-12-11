import type { OcpQuery } from 'api/queries/ocpQuery';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { OcpReport } from 'api/reports/ocpReports';
import type { ReportPathsType } from 'api/reports/report';
import type { ReportType } from 'api/reports/report';
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
import { useQueryFromRoute, useQueryState } from 'utils/hooks';
import { platformCategoryKey } from 'utils/props';

import { styles } from './gpuData.styles';
import { GpuTable } from './gpuTable';
import { GpuModal } from './modal/gpuModal';

interface GpuContentOwnProps {
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

export interface GpuContentStateProps {
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface GpuContentMapProps {
  query?: OcpQuery;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

type GpuContentProps = GpuContentOwnProps;

const baseQuery: OcpQuery = {
  filter: {
    limit: 3,
    offset: 0,
  },
  order_by: {
    gpu_count: 'desc',
  },
};

const GpuData: React.FC<GpuContentProps> = ({ reportPathsType, reportType }) => {
  const intl = useIntl();
  const location = useLocation();

  const queryState = getQueryState(location, 'gpu');
  const [query, setQuery] = useState({ ...baseQuery, ...(queryState && queryState) });
  const { report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({
    query,
    reportPathsType,
    reportType,
  });

  const [isOpen, setIsOpen] = useState(false);

  const getMoreLink = () => {
    const count = report?.meta?.count ?? 0;
    const remaining = Math.max(0, count - baseQuery.filter.limit);

    if (remaining > 0) {
      return (
        <div style={styles.linkContainer}>
          <a data-testid="gpu-lnk" href="#/" onClick={handleOpen}>
            {intl.formatMessage(messages.detailsMore, { value: remaining })}
          </a>
          <GpuModal
            isOpen={isOpen}
            onClose={handleClose}
            reportPathsType={reportPathsType}
            reportType={reportType}
            title={intl.formatMessage(messages.gpuTitle)}
          />
        </div>
      );
    }
    return null;
  };

  const getTable = () => {
    return (
      <GpuTable
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        report={report}
        reportQueryString={reportQueryString}
      />
    );
  };

  const handleClose = (value: boolean) => {
    setIsOpen(value);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const handleOpen = event => {
    setIsOpen(true);
    event.preventDefault();
    return false;
  };

  if (reportError) {
    return <NotAvailable />;
  }
  return (
    <>
      {reportFetchStatus === FetchStatus.inProgress ? (
        <div style={styles.loading}>
          <LoadingState />
        </div>
      ) : (
        <>
          {getTable()}
          {getMoreLink()}
        </>
      )}
    </>
  );
};

const useMapToProps = ({ query, reportPathsType, reportType }: GpuContentMapProps): GpuContentStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState();

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  const isFilterByExact = groupBy && groupByValue !== '*';
  const timeScopeValue = getTimeScopeValue(queryState);

  const reportQuery: Query = {
    filter: {
      ...query.filter,
      limit: query.filter.limit,
      offset: query.filter.offset,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: timeScopeValue,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
      // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      // Note: We're not inserting PVC information for the 'Platform' project
      ...(isFilterByExact && {
        [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
        [`exact:${groupBy}`]: groupByValue,
      }),
      ...query.filter_by,
    },
    exclude: {
      ...(queryState?.exclude && queryState.exclude),
    },
    group_by: {
      ...(groupBy && { [groupBy]: isFilterByExact ? '*' : groupByValue }),
    },
    order_by: query.order_by || baseQuery.order_by,
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
  }, [query]);

  return {
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export { GpuData };
