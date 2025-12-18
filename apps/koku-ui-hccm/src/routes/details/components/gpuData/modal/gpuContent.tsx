import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import type { ReportPathsType } from 'api/reports/report';
import type { ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import * as queryUtils from 'routes/utils/query';
import { FetchStatus } from 'store/common';

import { useMapToProps } from '../utils';
import { styles } from './gpuContent.styles';
import { GpuTable } from './gpuTable';
import { GpuToolbar } from './gpuToolbar';

interface GpuContentOwnProps {
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

type GpuContentProps = GpuContentOwnProps;

const baseQuery: OcpQuery = {
  filter: {
    limit: 10,
    offset: 0,
  },
  order_by: {
    gpu_count: 'desc',
  },
};

const GpuContent: React.FC<GpuContentProps> = ({ reportPathsType, reportType }) => {
  const intl = useIntl();

  const [query, setQuery] = useState({ ...baseQuery });
  const { report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({
    query,
    reportPathsType,
    reportType,
  });

  const getPagination = (isDisabled = false, isBottom = false) => {
    const count = report?.meta ? report.meta.count : 0;
    const limit = report?.meta ? report.meta.limit : baseQuery.filter.limit;
    const offset = report?.meta ? report.meta.offset : baseQuery.filter.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => handleOnPerPageSelect(perPage)}
        onSetPage={(event, pageNumber) => handleOnSetPage(pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  const getTable = () => {
    return (
      <GpuTable
        filterBy={query.filter_by}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        report={report}
        reportQueryString={reportQueryString}
      />
    );
  };

  const getToolbar = () => {
    const itemsPerPage = report?.meta ? report.meta.limit : 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;
    const isDisabled = itemsTotal === 0;

    return (
      <GpuToolbar
        isDisabled={isDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination(isDisabled)}
        query={query}
      />
    );
  };

  const handleOnFilterAdded = filter => {
    const newQuery = queryUtils.handleOnFilterAdded(query, filter);
    setQuery(newQuery);
  };

  const handleOnFilterRemoved = filter => {
    const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
    setQuery(newQuery);
  };

  const handleOnPerPageSelect = perPage => {
    const newQuery = queryUtils.handleOnPerPageSelect(query, perPage, false);
    setQuery(newQuery);
  };

  const handleOnSetPage = pageNumber => {
    const newQuery = queryUtils.handleOnSetPage(query, report, pageNumber, false);
    setQuery(newQuery);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const itemsTotal = report?.meta ? report.meta.count : 0;
  const isDisabled = itemsTotal === 0;

  if (reportError) {
    return <NotAvailable />;
  }
  return (
    <div style={styles.container}>
      {getToolbar()}
      {reportFetchStatus === FetchStatus.inProgress ? (
        <div style={styles.loading}>
          <LoadingState
            body={intl.formatMessage(messages.gpuLoadingStateDesc)}
            heading={intl.formatMessage(messages.gpuLoadingStateTitle)}
          />
        </div>
      ) : (
        <>
          {getTable()}
          <div style={styles.pagination}>{getPagination(isDisabled, true)}</div>
        </>
      )}
    </div>
  );
};

export { GpuContent };
