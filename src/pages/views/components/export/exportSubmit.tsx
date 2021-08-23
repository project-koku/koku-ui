import { Button, ButtonVariant } from '@patternfly/react-core';
import { Export } from 'api/exports/export';
import { getQuery, orgUnitIdKey, Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import fileDownload from 'js-file-download';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { exportActions, exportSelectors } from 'store/exports';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

export interface ExportSubmitOwnProps {
  groupBy?: string;
  isAllItems?: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  onError(error: AxiosError);
  query?: Query;
  reportPathsType: ReportPathsType;
  resolution: string;
  timeScope: 'current' | 'previous';
}

interface ExportSubmitDispatchProps {
  exportReport?: typeof exportActions.exportReport;
}

interface ExportSubmitStateProps {
  queryString: string;
  report: Export;
  reportError: AxiosError;
  reportFetchStatus?: FetchStatus;
}

interface ExportSubmitState {
  fetchReportClicked: boolean;
}

type ExportSubmitProps = ExportSubmitOwnProps &
  ExportSubmitDispatchProps &
  ExportSubmitStateProps &
  WrappedComponentProps;

const reportType = ReportType.cost;

export class ExportSubmitBase extends React.Component<ExportSubmitProps> {
  protected defaultState: ExportSubmitState = {
    fetchReportClicked: false,
  };
  public state: ExportSubmitState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
  }

  public componentDidUpdate(prevProps: ExportSubmitProps) {
    const { report, reportError } = this.props;
    const { fetchReportClicked } = this.state;

    if (prevProps.report !== report && fetchReportClicked) {
      this.getExport();
    }
    if (reportError) {
      this.props.onError(reportError);
    }
  }

  private getExport = () => {
    const { report, reportFetchStatus } = this.props;

    if (report && reportFetchStatus === FetchStatus.complete) {
      fileDownload(report.data, this.getFileName(), 'text/csv');
      this.handleClose();
    }
  };

  private getFileName = () => {
    const { groupBy, intl, reportPathsType, resolution, timeScope } = this.props;

    const thisMonth = new Date();
    const lastMonth = new Date().setMonth(thisMonth.getMonth() - 1);
    const currentMonth = format(thisMonth, 'MMMM_yyyy');
    const previousMonth = format(lastMonth - 1, 'MMMM_yyyy');

    // defaultMessage: '{provider}-{groupBy}-{resolution}-{date}',
    const fileName = intl.formatMessage(messages.ExportFileName, {
      provider: reportPathsType,
      groupBy: intl.formatMessage(messages.GroupByValues, { value: groupBy, count: 2 }),
      resolution: intl.formatMessage(messages.ExportResolution, { value: resolution }),
      date: timeScope && timeScope === 'previous' ? previousMonth : currentMonth,
    });

    return `${fileName}.csv`;
  };

  private handleClose = () => {
    const { reportError } = this.props;

    this.setState({ ...this.defaultState }, () => {
      if (!reportError) {
        this.props.onClose(false);
      }
    });
  };

  private handleFetchReport = () => {
    const { exportReport, queryString, reportPathsType } = this.props;

    exportReport(reportPathsType, reportType, queryString);

    this.setState(
      {
        fetchReportClicked: true,
      },
      () => {
        this.getExport();
      }
    );
  };

  public render() {
    const { intl, reportFetchStatus } = this.props;

    return (
      <Button
        {...getTestProps(testIds.export.submit_btn)}
        isDisabled={reportFetchStatus === FetchStatus.inProgress}
        key="confirm"
        onClick={this.handleFetchReport}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.ExportDownload)}
      </Button>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportSubmitOwnProps, ExportSubmitStateProps>((state, props) => {
  const { groupBy, isAllItems, items, query, reportPathsType, resolution, timeScope } = props;

  const getQueryString = () => {
    const newQuery: Query = {
      ...JSON.parse(JSON.stringify(query)),
      filter: {
        limit: undefined,
        offset: undefined,
        resolution: resolution ? resolution : undefined,
        time_scope_value: timeScope === 'previous' ? -2 : -1,
      },
      filter_by: {},
      limit: 0,
      order_by: undefined,
      perspective: undefined,
      dateRange: undefined,
    };

    // Store filter_by as an array so we can add to it below
    if (query.filter_by) {
      for (const key of Object.keys(query.filter_by)) {
        if (newQuery.filter_by[key] === undefined) {
          newQuery.filter_by[key] = [];
        }
        newQuery.filter_by[key].push(query.filter_by[key]);
      }
    }

    if (isAllItems) {
      // Ensure group_by isn't overridden -- org_unit_id is not unique
      if (groupBy === orgUnitIdKey) {
        if (newQuery.filter_by[orgUnitIdKey] === undefined) {
          newQuery.filter_by[orgUnitIdKey] = [];
        }
        newQuery.filter_by[orgUnitIdKey].push(query.group_by[orgUnitIdKey]);
      }
    } else {
      if (groupBy === orgUnitIdKey) {
        for (const item of items) {
          // Note that type only exists when grouping by org units
          const type = item.type === 'organizational_unit' ? orgUnitIdKey : item.type;
          if (newQuery.filter_by[type] === undefined) {
            newQuery.filter_by[type] = [];
          }
          newQuery.filter_by[type].push(item.id);
        }
      } else {
        for (const item of items) {
          if (newQuery.filter_by[groupBy] === undefined) {
            newQuery.filter_by[groupBy] = [];
          }
          newQuery.filter_by[groupBy].push(item.id);
        }
      }
    }
    return getQuery(newQuery);
  };

  const queryString = getQueryString();
  const report = exportSelectors.selectExport(state, reportPathsType, reportType, queryString);
  const reportError = exportSelectors.selectExportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = exportSelectors.selectExportFetchStatus(state, reportPathsType, reportType, queryString);

  return {
    queryString,
    report,
    reportError,
    reportFetchStatus,
  };
});

const mapDispatchToProps: ExportSubmitDispatchProps = {
  exportReport: exportActions.exportReport,
};

const ExportSubmitConnect = connect(mapStateToProps, mapDispatchToProps)(ExportSubmitBase);
const ExportSubmit = injectIntl(ExportSubmitConnect);

export { ExportSubmit, ExportSubmitProps };
