import { PageSection, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { Loading } from 'routes/components/page/loading';
import { NotAvailable } from 'routes/components/page/notAvailable';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';

import { styles } from './platformProjects.styles';
import { PlatformTable } from './platformTable';
import { PlatformToolbar } from './platformToolbar';

interface PlatformProjectsOwnProps {
  canWrite?: boolean;
}

export interface PlatformProjectsMapProps {
  query?: Query;
}

export interface PlatformProjectsStateProps {
  isReadOnly?: boolean;
  report?: Report;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

type PlatformProjectsProps = PlatformProjectsOwnProps;

const baseQuery: Query = {
  filter: {
    resolution: 'monthly',
    time_scope_units: 'month',
    time_scope_value: -1,
    limit: 10,
    offset: 0,
  },
  filter_by: {},
  group_by: {
    project: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const PlatformProjects: React.FC<PlatformProjectsProps> = ({ canWrite }) => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [query, setQuery] = useState({ ...baseQuery });
  const [selectedItems, setSelectedItems] = useState([]);
  const intl = useIntl();

  const { report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({ query });

  const getComputedItems = () => {
    return getUnsortedComputedReportItems({
      report,
      idKey: 'project' as any,
    });
  };

  const getPagination = (isDisabled = false, isBottom = false) => {
    const count = report && report.meta ? report.meta.count : 0;
    const limit =
      report && report.meta && report.meta.filter && report.meta.filter.limit
        ? report.meta.filter.limit
        : baseQuery.filter.limit;
    const offset =
      report && report.meta && report.meta.filter && report.meta.filter.offset
        ? report.meta.filter.offset
        : baseQuery.filter.offset;
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
          paginationTitle: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`exports-pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  const getTable = () => {
    return (
      <PlatformTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        orderBy={query.order_by}
        onSelected={handleOnSelected}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        report={report}
        reportQueryString={reportQueryString}
        selectedItems={selectedItems}
      />
    );
  };

  const getToolbar = (computedItems: ComputedReportItem[]) => {
    const isDisabled = computedItems.length === 0;
    const itemsTotal = report && report.meta ? report.meta.count : 0;

    return (
      <PlatformToolbar
        canWrite={canWrite}
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onAddProjects={handleOnAddProjects}
        onBulkSelected={handleOnBulkSelected}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onRemoveProjects={handleOnRemoveProjects}
        pagination={getPagination(isDisabled)}
        query={query}
        selectedItems={selectedItems}
      />
    );
  };

  const handleOnBulkSelected = (action: string) => {
    if (action === 'none') {
      setIsAllSelected(false);
      setSelectedItems([]);
    } else if (action === 'page') {
      setIsAllSelected(false);
      setSelectedItems(getComputedItems());
    } else if (action === 'all') {
      setIsAllSelected(!isAllSelected);
      setSelectedItems([]);
    }
  };

  const handleOnAddProjects = () => {};

  const handleOnRemoveProjects = () => {};

  const handleOnFilterAdded = filter => {
    const newQuery = queryUtils.handleOnFilterAdded(query, filter);
    setQuery(newQuery);
  };

  const handleOnFilterRemoved = filter => {
    const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
    setQuery(newQuery);
  };

  const handleOnPerPageSelect = perPage => {
    const newQuery = queryUtils.handleOnPerPageSelect(query, perPage);
    setQuery(newQuery);
  };

  const handleOnSetPage = pageNumber => {
    const newQuery = queryUtils.handleOnSetPage(query, report, pageNumber);
    setQuery(newQuery);
  };

  const handleOnSelected = (items: ComputedReportItem[], isSelected: boolean = false) => {
    let newItems = [...(isAllSelected ? getComputedItems() : selectedItems)];
    if (items && items.length > 0) {
      if (isSelected) {
        items.map(item => newItems.push(item));
      } else {
        items.map(item => {
          newItems = newItems.filter(val => val.id !== item.id);
        });
      }
    }
    setIsAllSelected(false);
    setSelectedItems(newItems);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const computedItems = getComputedItems();
  const isDisabled = computedItems.length === 0;

  // Note: Providers are fetched via the AccountSettings component used by all routes
  if (reportError) {
    return <NotAvailable />;
  }
  return (
    <PageSection isFilled>
      <div style={styles.descContainer}>
        {intl.formatMessage(messages.platfomProjectaDesc, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsConfigPlatformProjects)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
        })}
      </div>
      {getToolbar(computedItems)}
      {reportFetchStatus === FetchStatus.inProgress ? (
        <Loading />
      ) : (
        <>
          {getTable()}
          <div style={styles.pagination}>{getPagination(isDisabled, true)}</div>
        </>
      )}
    </PageSection>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = ({ query }: PlatformProjectsMapProps): PlatformProjectsStateProps => {
  const reportType = ReportType.cost;
  const reportPathsType = ReportPathsType.ocp;
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const reportQueryString = getQuery(query);
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

export default PlatformProjects;
