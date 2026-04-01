import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { getQuery, parseQuery } from 'api/queries/ocpQuery';
import type { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { routes } from 'routes';
import { ExportModal } from 'routes/components/export';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { handleOnPerPageSelect, handleOnSetPage, handleOnSort } from 'routes/utils/queryNavigate';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { uiActions } from 'store/ui';
import type { openProvidersModal } from 'store/ui/uiActions';
import { formatPath } from 'utils/paths';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';
import { getCurrency } from 'utils/sessionStorage';

import { styles } from './efficiency.styles';
import { EfficiencyTable } from './efficiencyTable';

interface EfficiencyComputeOwnProps extends RouterComponentProps, WrappedComponentProps {
  isCurrentMonthData: boolean;
  timeScopeValue?: number;
}

export interface EfficiencyComputeStateProps {
  query: OcpQuery;
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface EfficiencyComputeDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
  openProvidersModal: typeof openProvidersModal;
}

interface EfficiencyComputeState {
  isExportModalOpen?: boolean;
}

type EfficiencyComputeProps = EfficiencyComputeStateProps & EfficiencyComputeOwnProps & EfficiencyComputeDispatchProps;

const baseQuery: OcpQuery = {
  filter: {
    limit: 10,
    offset: 0,
  },
  filter_by: {},
  exclude: {},
  group_by: {
    project: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

class EfficiencyCompute extends React.Component<EfficiencyComputeProps, EfficiencyComputeState> {
  protected defaultState: EfficiencyComputeState = {
    isExportModalOpen: false,
  };
  public state: EfficiencyComputeState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: EfficiencyComputeProps) {
    const { report, reportError, reportQueryString, router } = this.props;

    const newQuery = prevProps.reportQueryString !== reportQueryString;
    const noReport = !report && !reportError;
    const noLocation = !router.location.search;

    if (newQuery || noReport || noLocation) {
      this.updateReport();
    }
  }

  private getComputedItems = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);

    return getUnsortedComputedReportItems({
      report,
      idKey: groupById,
    });
  };

  private getExportModal = () => {
    const { query, reportQueryString, timeScopeValue } = this.props;
    const { isExportModalOpen } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);

    return (
      <ExportModal
        isAllItems
        groupBy={groupById}
        isOpen={isExportModalOpen}
        isTimeScoped
        onClose={this.handleOnExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  private getPagination = (isDisabled = false, isBottom = false) => {
    const { intl, query, report, router } = this.props;

    const count = report?.meta ? report.meta.count : 0;
    const limit = report?.meta?.filter?.limit ? report.meta.filter.limit : baseQuery.filter.limit;
    const offset = report?.meta?.filter?.offset ? report.meta.filter.offset : baseQuery.filter.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => handleOnPerPageSelect(query, router, perPage)}
        onSetPage={(event, pageNumber) => handleOnSetPage(query, router, report, pageNumber)}
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

  private getTable = () => {
    const { query, report, reportFetchStatus, reportQueryString, router, timeScopeValue } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);

    return (
      <EfficiencyTable
        basePath={formatPath(routes.ocpBreakdown.path)}
        breadcrumbPath={formatPath(`${routes.ocpDetails.path}${location.search}`)}
        exclude={query.exclude}
        filterBy={query.filter_by}
        groupBy={groupById}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleOnSort(query, router, sortType, isSortAscending)}
        orderBy={query.order_by}
        query={query}
        report={report}
        reportQueryString={reportQueryString}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  private handleOnExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  // Todo: was DetailsToolbar.onExportClicked={this.handleOnExportModalOpen}
  // private handleOnExportModalOpen = () => {
  //   this.setState({ isExportModalOpen: true });
  // };

  private updateReport = () => {
    const { fetchReport, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { intl, reportError, reportFetchStatus } = this.props;

    const computedItems = this.getComputedItems();
    const isDisabled = computedItems?.length === 0;
    const title = intl.formatMessage(messages.ocpDetailsTitle);

    if (reportError) {
      return <NotAvailable title={title} />;
    } else if (reportFetchStatus === FetchStatus.inProgress) {
      return <LoadingState />;
    }

    return (
      <Card>
        <CardBody>
          {this.getExportModal()}
          {this.getTable()}
          <div style={styles.paginationContainer}>{this.getPagination(isDisabled, true)}</div>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = createMapStateToProps<EfficiencyComputeOwnProps, EfficiencyComputeStateProps>(
  (state, { router, timeScopeValue }) => {
    const queryFromRoute = parseQuery<OcpQuery>(router.location.search);
    const currency = getCurrency();

    const query: any = {
      ...baseQuery,
      ...queryFromRoute,
    };

    const reportQuery = {
      category: query.category,
      currency,
      delta: 'cost',
      exclude: query.exclude,
      filter: {
        ...query.filter,
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: timeScopeValue,
      },
      filter_by: query.filter_by,
      group_by: query.group_by,
      order_by: query.order_by,
    };

    const reportQueryString = getQuery(reportQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
    const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      reportQueryString
    );

    return {
      currency,
      query,
      report,
      reportError,
      reportFetchStatus,
      reportQueryString,
    };
  }
);

const mapDispatchToProps: EfficiencyComputeDispatchProps = {
  fetchReport: reportActions.fetchReport,
  openProvidersModal: uiActions.openProvidersModal,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(EfficiencyCompute)));
