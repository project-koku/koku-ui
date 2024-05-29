import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
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
import { NoInstances } from 'routes/components/page/noInstances';
import { NotAvailable } from 'routes/components/page/notAvailable';
import type { ColumnManagementModalOption } from 'routes/details/components/columnManagement';
import { ColumnManagementModal, initHiddenColumns } from 'routes/details/components/columnManagement';
import { styles } from 'routes/optimizations/optimizationsBreakdown/optimizationsBreakdown.styles';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { getFilterByTagKey } from 'routes/utils/groupBy';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { useQueryFromRoute, useQueryState } from 'utils/hooks';
import { accountKey, logicalAndPrefix, logicalOrPrefix, orgUnitIdKey, regionKey } from 'utils/props';

// import { data } from './data';
import { InstancesTable, InstanceTableColumnIds } from './instancesTable';
import { InstancesToolbar } from './instancesToolbar';

interface InstancesOwnProps {
  currency?: string;
}

export interface InstancesStateProps {
  hasAccountFilter: boolean;
  hasRegionFilter: boolean;
  hasTagFilter: boolean;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface InstancesMapProps {
  // TBD...
}

type InstancesProps = InstancesOwnProps;

const baseQuery: Query = {
  filter: {
    limit: 10,
    offset: 0,
  },
  order_by: {
    cost: 'desc',
  },
};

const defaultColumnOptions: ColumnManagementModalOption[] = [
  {
    label: messages.vcpuTitle,
    value: InstanceTableColumnIds.vcpu,
    hidden: true,
  },
  {
    label: messages.memoryTitle,
    value: InstanceTableColumnIds.memory,
    hidden: true,
  },
];

const reportType = ReportType.ec2Compute;
const reportPathsType = ReportPathsType.aws;

const Instances: React.FC<InstancesProps> = ({ currency }) => {
  const intl = useIntl();

  const [hiddenColumns, setHiddenColumns] = useState(initHiddenColumns(defaultColumnOptions));
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isColumnManagementModalOpen, setIsColumnManagementModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [query, setQuery] = useState({ ...baseQuery });
  const { hasAccountFilter, hasRegionFilter, hasTagFilter, report, reportError, reportFetchStatus, reportQueryString } =
    useMapToProps({
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
      idKey: 'resource_id' as any,
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
    // Todo: May need to adjust "instance" for group_by?
    return (
      <ExportModal
        count={isAllSelected ? itemsTotal : items.length}
        isAllItems={(isAllSelected || selectedItems.length === itemsTotal) && computedItems.length > 0}
        groupBy="instance"
        isOpen={isExportModalOpen}
        items={items}
        onClose={handleOnExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        showAggregateType={false}
      />
    );
  };

  const getPagination = (isDisabled = false, isBottom = false) => {
    const count = report?.meta?.count || 0;
    const limit = report?.meta?.limit || baseQuery.filter.limit;
    const offset = report?.meta?.offset || baseQuery.filter.offset;
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
      <InstancesTable
        filterBy={query.filter_by}
        hiddenColumns={hiddenColumns}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelect={handleonSelect}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        query={query}
        report={report}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        selectedItems={selectedItems}
      />
    );
  };

  const getToolbar = (computedItems: ComputedReportItem[]) => {
    const isDisabled = computedItems.length === 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;

    return (
      <InstancesToolbar
        hideAccount={hasAccountFilter}
        hideRegion={hasRegionFilter}
        hideTags={hasTagFilter}
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isExportDisabled={isDisabled || (!isAllSelected && selectedItems.length === 0)}
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
    const newQuery = queryUtils.handleOnPerPageSelect(query, perPage, false);
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
    const newQuery = queryUtils.handleOnSetPage(query, report, pageNumber, false);
    setQuery(newQuery);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const itemsTotal = report?.meta ? report.meta.count : 0;
  const isDisabled = itemsTotal === 0;
  const hasInstances = report?.meta && report.meta.count > 0;

  if (reportError) {
    return <NotAvailable title={intl.formatMessage(messages.optimizations)} />;
  }
  if (!query.filter_by && !hasInstances && reportFetchStatus === FetchStatus.complete) {
    return <NoInstances />;
  }
  const computedItems = getComputedItems();

  return (
    <>
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
    </>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = ({ currency, query }): InstancesStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState('details');

  const reportQuery = {
    currency,
    filter: {
      ...(query.filter || baseQuery.filter),
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
      // Workaround for https://issues.redhat.com/browse/COST-1189
      ...(queryState?.filter_by &&
        queryState.filter_by[orgUnitIdKey] && {
          [`${logicalOrPrefix}${orgUnitIdKey}`]: queryState.filter_by[orgUnitIdKey],
          [orgUnitIdKey]: undefined,
        }),
      ...(query.filter_by && query.filter_by),
    },
    exclude: {
      ...(queryState?.exclude && queryState.exclude),
      ...(query.exclude && query.exclude),
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
  }, [currency, query]);

  // Todo: Update to use new API response
  // report = data;

  return {
    hasAccountFilter: queryState?.filter_by?.[accountKey] !== undefined,
    hasRegionFilter: queryState?.filter_by?.[regionKey] !== undefined,
    hasTagFilter: getFilterByTagKey(queryState) !== undefined,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default Instances;
