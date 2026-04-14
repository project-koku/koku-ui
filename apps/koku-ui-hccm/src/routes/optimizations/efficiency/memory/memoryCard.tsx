import '../efficiencyCard.scss';

import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardTitle,
  Divider,
  Pagination,
  PaginationVariant,
  Popover,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { getQuery } from 'api/queries/ocpQuery';
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
import { routes } from 'routes';
import { getExportButton } from 'routes/components/dataToolbar/utils/actions';
import { ExportModal } from 'routes/components/export';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import * as queryUtils from 'routes/utils/query';
import { getQueryState } from 'routes/utils/queryState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getSinceDateRangeString } from 'utils/dates';
import { formatPath } from 'utils/paths';

import { styles } from '../efficiency.styles';
import { EfficiencySummary } from '../efficiencySummary';
import { EfficiencyTable } from '../efficiencyTable';

interface MemoryCardOwnProps {
  currency?: string;
  exclude?: any;
  filterBy?: any;
  groupBy?: string;
  timeScopeValue?: number;
}

export interface MemoryCardStateProps {
  computedItems?: any;
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface MemoryCardMapProps {
  currency?: string;
  exclude?: any;
  filterBy?: any;
  groupBy?: string;
  timeScopeValue?: number;
  query?: OcpQuery;
}

type MemoryCardProps = MemoryCardOwnProps;

const baseQuery: OcpQuery = {
  filter: {
    limit: 10,
    offset: 0,
    resolution: 'monthly',
    time_scope_units: 'month',
    time_scope_value: -1,
  },
  filter_by: {},
  exclude: {},
  group_by: {
    cluster: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const reportType = ReportType.memory;
const reportPathsType = ReportPathsType.ocp;

const MemoryCard: React.FC<MemoryCardProps> = ({ currency, exclude, filterBy, groupBy, timeScopeValue }) => {
  const intl = useIntl();
  const location = useLocation();

  const queryState = getQueryState(location, 'efficiencyMemory');
  const [query, setQuery] = useState({ ...baseQuery, ...(queryState && queryState) });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const { computedItems, report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({
    currency,
    exclude,
    filterBy,
    groupBy,
    query,
    timeScopeValue,
  });

  const getExportButtonComponent = () => {
    return getExportButton({
      isDisabled: computedItems?.length === 0,
      onExportClicked: handleOnExportModalOpen,
    });
  };

  const getExportModal = () => {
    return (
      <ExportModal
        count={report?.meta ? report.meta.count : 0}
        isAllItems
        groupBy={groupBy}
        isOpen={isExportModalOpen}
        isTimeScoped
        onClose={handleOnExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  const getPagination = (isBottom = false) => {
    const count = report?.meta ? report.meta.count : 0;
    const limit = report?.meta?.filter?.limit ? report.meta.filter.limit : baseQuery.filter.limit;
    const offset = report?.meta?.filter?.offset ? report.meta.filter.offset : baseQuery.filter.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={computedItems?.length === 0}
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
      <EfficiencyTable
        basePath={formatPath(routes.optimizations.path)}
        exclude={exclude}
        filterBy={filterBy}
        groupBy={groupBy}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        report={report}
      />
    );
  };

  const handleOnExportModalClose = () => {
    setIsExportModalOpen(false);
  };

  const handleOnExportModalOpen = () => {
    setIsExportModalOpen(true);
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

  if (reportError) {
    return <NotAvailable title={intl.formatMessage(messages.ocpDetailsTitle)} />;
  } else if (reportFetchStatus === FetchStatus.inProgress) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardTitle>
        <Title headingLevel="h2" size={TitleSizes.lg}>
          {intl.formatMessage(messages.memoryEfficiency)}
          <span>
            <Popover
              aria-label={intl.formatMessage(messages.overviewInfoArialLabel)}
              bodyContent={
                <>
                  <Title headingLevel="h4">{intl.formatMessage(messages.memoryEfficiency)}</Title>
                  <br />
                  <Title className="formula" headingLevel="h4">
                    {intl.formatMessage(messages.formula)}
                  </Title>
                  <p>{intl.formatMessage(messages.memoryEfficiencyInfoFormulaUsageScore)}</p>
                  <p>{intl.formatMessage(messages.memoryEfficiencyInfoFormulaWasteCost)}</p>
                </>
              }
              enableFlip
              hasAutoWidth
            >
              <Button
                icon={<OutlinedQuestionCircleIcon />}
                aria-label={intl.formatMessage(messages.overviewInfoButtonArialLabel)}
                variant={ButtonVariant.plain}
              ></Button>
            </Popover>
          </span>
        </Title>
        <p className="subtitle">{getSinceDateRangeString(undefined, timeScopeValue === -2 ? 1 : 0, true)}</p>
      </CardTitle>
      <CardBody>
        <EfficiencySummary report={report} />
        <Divider />
        <Title headingLevel="h3" size={TitleSizes.lg} style={styles.tableTitle}>
          {intl.formatMessage(messages.memoryEfficiencyBreakdown)}
          <div style={styles.export}>{getExportButtonComponent()}</div>
        </Title>
        {getTable()}
        <div style={styles.paginationContainer}>{getPagination(true)}</div>
        {getExportModal()}
      </CardBody>
    </Card>
  );
};

const useMapToProps = ({
  currency,
  exclude,
  filterBy,
  groupBy,
  query,
  timeScopeValue,
}: MemoryCardMapProps): MemoryCardStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const reportQuery = {
    category: query.category,
    currency,
    exclude,
    filter: {
      limit: query.filter.limit,
      offset: query.filter.offset,
      resolution: query.filter.resolution,
      time_scope_units: query.filter.time_scope_units,
      time_scope_value: timeScopeValue,
    },
    filter_by: filterBy || query.filter_by,
    group_by: groupBy
      ? {
          [groupBy]: '*',
        }
      : query.group_by,
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
  }, [currency, exclude, filterBy, groupBy, query, timeScopeValue]);

  const getComputedItems = () => {
    return getUnsortedComputedReportItems({
      report,
      idKey: groupBy,
    });
  };

  return {
    computedItems: getComputedItems(),
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export { MemoryCard };
