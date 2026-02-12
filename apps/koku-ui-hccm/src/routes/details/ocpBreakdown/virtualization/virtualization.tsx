import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { ExportModal } from 'routes/components/export';
import { Loading } from 'routes/components/page/loading';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { NoVirtualization } from 'routes/components/page/noVirtualization';
import type { ColumnManagementModalOption } from 'routes/details/components/columnManagement';
import { ColumnManagementModal, initHiddenColumns } from 'routes/details/components/columnManagement';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import {
  getExcludeTagKey,
  getFilterByTagKey,
  getGroupById,
  getGroupByTagKey,
  getGroupByValue,
} from 'routes/utils/groupBy';
import * as queryUtils from 'routes/utils/query';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { useQueryFromRoute, useQueryState } from 'utils/hooks';
import { logicalAndPrefix } from 'utils/props';

import { styles } from './virtualization.styles';
import { VirtualizationTable, VirtualizationTableColumnIds } from './virtualizationTable';
import { VirtualizationToolbar } from './virtualizationToolbar';

interface VirtualizationOwnProps {
  costDistribution?: string;
  costType?: string;
  currency?: string;
}

export interface VirtualizationStateProps {
  groupBy: string;
  hasClusterFilter: boolean;
  hasNodeFilter: boolean;
  hasProjectFilter: boolean;
  hasTagFilter: boolean;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
  timeScopeValue?: number;
}

export interface VirtualizationMapProps {
  // TBD...
}

type VirtualizationProps = VirtualizationOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  order_by: {
    cost: 'desc',
  },
};

const defaultColumnOptions: ColumnManagementModalOption[] = [
  {
    label: messages.cpuTitle,
    value: VirtualizationTableColumnIds.cpu,
    hidden: true,
  },
  {
    label: messages.memoryTitle,
    value: VirtualizationTableColumnIds.memory,
    hidden: true,
  },
];

const reportType = ReportType.virtualization;
const reportPathsType = ReportPathsType.ocp;
const tagPathsType = TagPathsType.ocp;

const Virtualization: React.FC<VirtualizationProps> = ({ costDistribution, costType, currency }) => {
  const intl = useIntl();

  const [hiddenColumns, setHiddenColumns] = useState(initHiddenColumns(defaultColumnOptions));
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isColumnManagementModalOpen, setIsColumnManagementModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [query, setQuery] = useState({ ...baseQuery });
  const {
    hasClusterFilter,
    hasNodeFilter,
    hasProjectFilter,
    hasTagFilter,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
    timeScopeValue,
  } = useMapToProps({
    costType,
    currency,
    query,
  });

  const getColumnManagementModal = () => {
    const options = cloneDeep(defaultColumnOptions);
    options.map(option => {
      option.hidden = hiddenColumns.has(option.value);
    });

    return (
      <ColumnManagementModal
        isOpen={isColumnManagementModalOpen}
        options={options}
        onClose={handleOnColumnManagementModalClose}
        onSave={handleOnColumnManagementModalSave}
      />
    );
  };

  const getComputedItems = () => {
    return getUnsortedComputedReportItems({
      idKey: 'vm_name' as any,
      isGroupBy: false,
      report,
    });
  };

  const getExportModal = (computedItems: ComputedReportItem[]) => {
    const itemsTotal = report?.meta ? report.meta.count : 0;

    // Omit items labeled 'no-project'
    const items = [];
    selectedItems.map(item => {
      items.push(item);
    });

    return (
      <ExportModal
        count={isAllSelected ? itemsTotal : items.length}
        isAllItems={(isAllSelected || selectedItems.length === itemsTotal) && computedItems.length > 0}
        groupBy="vm_name"
        isOpen={isExportModalOpen}
        isTimeScoped
        items={items}
        onClose={handleOnExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        showAggregateType={false}
      />
    );
  };

  const getPagination = (isDisabled = false, isBottom = false) => {
    const count = report?.meta?.count || 0;
    const limit = report?.meta?.limit || baseQuery.limit;
    const offset = report?.meta?.offset || baseQuery.offset;
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
        widgetId={`exports-pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  const getTable = () => {
    return (
      <VirtualizationTable
        costDistribution={costDistribution}
        exclude={query.exclude}
        filterBy={query.filter_by}
        isClusterHidden={hasClusterFilter}
        hiddenColumns={hiddenColumns}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        isNodeHidden={hasNodeFilter}
        isProjectHidden={hasProjectFilter}
        onSelect={handleonSelect}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        query={query}
        report={report}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        selectedItems={selectedItems}
        tagPathsType={tagPathsType}
      />
    );
  };

  const getToolbar = (computedItems: ComputedReportItem[]) => {
    const isDisabled = computedItems.length === 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;

    return (
      <VirtualizationToolbar
        isTagHidden={hasTagFilter}
        isAllSelected={isAllSelected}
        isClusterHidden={hasClusterFilter}
        isDisabled={isDisabled}
        isExportDisabled={isDisabled || (!isAllSelected && selectedItems.length === 0)}
        isNodeHidden={hasNodeFilter}
        isProjectHidden={hasProjectFilter}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelect={handleOnBulkSelect}
        onColumnManagementClicked={handleOnColumnManagementModalOpen}
        onExportClicked={handleOnExportModalOpen}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination(isDisabled)}
        query={query}
        selectedItems={selectedItems}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  const handleOnBulkSelect = (action: string) => {
    if (action === 'none') {
      setIsAllSelected(false);
      setSelectedItems([]);
    } else if (action === 'page') {
      const newSelectedItems = [...selectedItems];
      getComputedItems().map(val => {
        if (!newSelectedItems.find(item => item.id === val.id)) {
          newSelectedItems.push(val);
        }
      });
      setIsAllSelected(false);
      setSelectedItems(newSelectedItems);
    } else if (action === 'all') {
      setIsAllSelected(!isAllSelected);
      setSelectedItems([]);
    }
  };

  const handleOnColumnManagementModalClose = (isOpen: boolean) => {
    setIsColumnManagementModalOpen(isOpen);
  };

  const handleOnColumnManagementModalOpen = () => {
    setIsColumnManagementModalOpen(true);
  };

  const handleOnColumnManagementModalSave = (newHiddenColumns: Set<string>) => {
    setHiddenColumns(newHiddenColumns);
  };

  const handleOnExportModalClose = (isOpen: boolean) => {
    setIsExportModalOpen(isOpen);
  };

  const handleOnExportModalOpen = () => {
    setIsExportModalOpen(true);
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
    const newQuery = queryUtils.handleOnPerPageSelect(query, perPage, true);
    setQuery(newQuery);
  };

  const handleonSelect = (items: ComputedReportItem[], isSelected: boolean = false) => {
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

  const handleOnSetPage = pageNumber => {
    const newQuery = queryUtils.handleOnSetPage(query, report, pageNumber, true);
    setQuery(newQuery);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const itemsTotal = report?.meta ? report.meta.count : 0;
  const isDisabled = itemsTotal === 0;
  const hasVirtualization = report?.meta?.count > 0;

  if (reportError) {
    return <NotAvailable isPageSection={false} />;
  }
  if (!query.filter_by && !query.exclude && !hasVirtualization && reportFetchStatus === FetchStatus.complete) {
    return <NoVirtualization isPageSection={false} />;
  }

  const computedItems = getComputedItems();

  return (
    <Card>
      <CardBody>
        {getExportModal(computedItems)}
        {getColumnManagementModal()}
        {getToolbar(computedItems)}
        {reportFetchStatus === FetchStatus.inProgress ? (
          <Loading />
        ) : (
          <>
            {getTable()}
            <div style={styles.pagination}>{getPagination(isDisabled, true)}</div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

const useMapToProps = ({ costType, currency, query }): VirtualizationStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState('details');

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  const isFilterByExact = groupBy && groupByValue !== '*';
  const timeScopeValue = getTimeScopeValue(queryState);

  const reportQuery = {
    cost_type: costType,
    currency,
    filter: {
      ...(query.filter || baseQuery.filter),
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: timeScopeValue,
      ...(!isFilterByExact && { [groupBy]: groupByValue }), // Required for 'Platform' project
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
      ...(query.filter_by && query.filter_by),
      ...(isFilterByExact && {
        [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
        [`exact:${groupBy}`]: groupByValue,
      }),
    },
    exclude: {
      ...(queryState?.exclude && queryState.exclude),
      ...(query.exclude && query.exclude),
    },
    limit: query.limit,
    offset: query.offset,
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
  }, [costType, currency, query]);

  return {
    groupBy,
    hasClusterFilter:
      groupBy === 'cluster' ||
      queryState?.filter_by?.cluster !== undefined ||
      queryState?.exclude?.cluster !== undefined,
    hasNodeFilter:
      groupBy === 'node' || queryState?.filter_by?.node !== undefined || queryState?.exclude?.node !== undefined,
    hasProjectFilter:
      groupBy === 'project' ||
      queryState?.filter_by?.project !== undefined ||
      queryState?.exclude?.project !== undefined,
    hasTagFilter:
      getGroupByTagKey(queryFromRoute) !== undefined ||
      getFilterByTagKey(queryState) !== undefined ||
      getExcludeTagKey(queryState),
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
    timeScopeValue,
  };
};

export default Virtualization;
