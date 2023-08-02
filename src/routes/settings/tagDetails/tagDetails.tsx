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
import { rbacActions, rbacSelectors } from 'store/rbac';
import { reportActions, reportSelectors } from 'store/reports';

import { styles } from './tagDetails.styles';
import { TagTable } from './tagTable';
import { TagToolbar } from './tagToolbar';

interface TagDetailsOwnProps {
  canWrite?: boolean;
}

export interface TagDetailsMapProps {
  query?: Query;
}

export interface TagDetailsStateProps {
  isReadOnly?: boolean;
  report?: Report;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

type TagDetailsProps = TagDetailsOwnProps;

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

const TagDetails: React.FC<TagDetailsProps> = () => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [query, setQuery] = useState({ ...baseQuery });
  const [selectedItems, setSelectedItems] = useState([]);
  const intl = useIntl();

  const { isReadOnly, report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({ query });

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
      <TagTable
        filterBy={query.filter_by}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        isReadOnly={isReadOnly}
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
      <TagToolbar
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelected={handleOnBulkSelected}
        onDisableTags={handleOnDisableTags}
        onEnableTags={handleOnEnableTags}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
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

  const handleOnDisableTags = () => {};

  const handleOnEnableTags = () => {};

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
        {intl.formatMessage(messages.tagDesc, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsConfigTags)} rel="noreferrer" target="_blank">
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
const useMapToProps = ({ query }: TagDetailsMapProps): TagDetailsStateProps => {
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

  const canWrite = useSelector((state: RootState) => rbacSelectors.isSettingsWritePermission(state));
  const rbacStatus = useSelector((state: RootState) => rbacSelectors.selectRbacStatus(state));
  const rbacError = useSelector((state: RootState) => rbacSelectors.selectRbacError(state));

  useEffect(() => {
    if (!reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(reportActions.fetchReport(reportPathsType, reportType, reportQueryString));
    }
    if (!rbacError && rbacStatus !== FetchStatus.inProgress) {
      dispatch(rbacActions.fetchRbac());
    }
  }, [query]);

  return {
    isReadOnly: !canWrite,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default TagDetails;
