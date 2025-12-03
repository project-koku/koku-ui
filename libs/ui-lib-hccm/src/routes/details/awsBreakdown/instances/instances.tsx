import type { Query } from '@koku-ui/api/queries/query';
import { getQuery } from '@koku-ui/api/queries/query';
import type { Report } from '@koku-ui/api/reports/report';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { RootState } from '../../../../store';
import { FetchStatus } from '../../../../store/common';
import { reportActions, reportSelectors } from '../../../../store/reports';
import { useQueryFromRoute, useQueryState } from '../../../../utils/hooks';
import { accountKey, logicalAndPrefix, orgUnitIdKey, regionKey, serviceKey } from '../../../../utils/props';
import { ExportModal } from '../../../components/export';
import { NoInstances } from '../../../components/page/noInstances';
import { NotAvailable } from '../../../components/page/notAvailable';
import { LoadingState } from '../../../components/state/loadingState';
import type { ComputedReportItem } from '../../../utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from '../../../utils/computedReport/getComputedReportItems';
import { getExcludeTagKey, getFilterByTagKey } from '../../../utils/groupBy';
import * as queryUtils from '../../../utils/query';
import { getTimeScopeValue } from '../../../utils/timeScope';
import type { ColumnManagementModalOption } from '../../components/columnManagement';
import { ColumnManagementModal, initHiddenColumns } from '../../components/columnManagement';
import { styles } from './instances.styles';
import { InstancesTable, InstanceTableColumnIds } from './instancesTable';
import { InstancesToolbar } from './instancesToolbar';

interface InstancesOwnProps {
  costType?: string;
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
  timeScopeValue?: number;
}

export interface InstancesMapProps {
  // TBD...
}

type InstancesProps = InstancesOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
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
  {
    label: messages.usage,
    value: InstanceTableColumnIds.usage,
    hidden: true,
  },
];

const reportType = ReportType.ec2Compute;
const reportPathsType = ReportPathsType.aws;

const Instances: React.FC<InstancesProps> = ({ costType, currency }) => {
  const intl = useIntl();

  const [hiddenColumns, setHiddenColumns] = useState(initHiddenColumns(defaultColumnOptions));
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isColumnManagementModalOpen, setIsColumnManagementModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [query, setQuery] = useState({ ...baseQuery });
  const {
    hasAccountFilter,
    hasRegionFilter,
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
        isTimeScoped
        items={items}
        onClose={handleOnExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        showAggregateType={false}
        timeScopeValue={timeScopeValue}
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
      <InstancesTable
        exclude={query.exclude}
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
        reportType={reportType}
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
        hideTag={hasTagFilter}
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
  const hasInstances = report?.meta?.count > 0;

  if (reportError) {
    return <NotAvailable isPageSection={false} />;
  }
  if (!query.filter_by && !query.exclude && !hasInstances && reportFetchStatus === FetchStatus.complete) {
    return <NoInstances isPageSection={false} />;
  }

  const computedItems = getComputedItems();

  return (
    <Card>
      <CardBody>
        {getExportModal(computedItems)}
        {getColumnManagementModal()}
        {getToolbar(computedItems)}
        {reportFetchStatus === FetchStatus.inProgress ? (
          <LoadingState />
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

const useMapToProps = ({ costType, currency, query }): InstancesStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState('details');
  const timeScopeValue = getTimeScopeValue(queryState);

  const reportQuery = {
    cost_type: costType,
    currency,
    filter: {
      ...(query.filter || baseQuery.filter),
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: timeScopeValue,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.filter?.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
      ...(query.filter_by && query.filter_by),
      [orgUnitIdKey]: undefined, // Unsupported filter
      [serviceKey]: undefined, // Unsupported filter
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
    hasAccountFilter:
      queryState?.filter_by?.[accountKey] !== undefined || queryState?.exclude?.[accountKey] !== undefined,
    hasRegionFilter: queryState?.filter_by?.[regionKey] !== undefined || queryState?.exclude?.[regionKey] !== undefined,
    hasTagFilter: getFilterByTagKey(queryState) !== undefined || getExcludeTagKey(queryState),
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
    timeScopeValue,
  };
};

export default Instances;
