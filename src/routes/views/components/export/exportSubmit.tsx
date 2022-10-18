import { Button, ButtonVariant } from '@patternfly/react-core';
import { Export } from 'api/export/export';
import { getQuery, orgUnitIdKey, Query, tagPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import fileDownload from 'js-file-download';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { getDateRange } from 'routes/views/utils/dateRange';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { exportActions, exportSelectors } from 'store/export';
import { featureFlagsSelectors } from 'store/featureFlags';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getToday } from 'utils/dates';

export interface ExportSubmitOwnProps {
  disabled?: boolean;
  formatType: 'csv' | 'json';
  groupBy?: string;
  isAllItems?: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  onError(error: AxiosError);
  name?: string;
  query?: Query;
  reportPathsType: ReportPathsType;
  resolution: string;
  timeScope: 'current' | 'previous';
}

interface ExportSubmitDispatchProps {
  exportReport?: typeof exportActions.exportReport;
}

interface ExportSubmitStateProps {
  endDate: string;
  isExportsFeatureEnabled?: boolean;
  queryString: string;
  report: Export;
  reportError: AxiosError;
  reportFetchStatus?: FetchStatus;
  startDate: string;
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
    const { endDate, groupBy, intl, reportPathsType, resolution, startDate } = this.props;

    // defaultMessage: '<provider>_<groupBy>_<resolution>_<start-date>_<end-date>',
    const fileName = intl.formatMessage(messages.exportFileName, {
      endDate,
      provider: reportPathsType,
      groupBy: groupBy.indexOf(tagPrefix) !== -1 ? 'tag' : groupBy,
      resolution,
      startDate,
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
    const { exportReport, isExportsFeatureEnabled, queryString, reportPathsType } = this.props;

    exportReport(reportPathsType, reportType, queryString, isExportsFeatureEnabled);

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
    const { disabled, intl, reportFetchStatus } = this.props;

    return (
      <Button
        {...getTestProps(testIds.export.submit_btn)}
        isDisabled={disabled || reportFetchStatus === FetchStatus.inProgress}
        key="confirm"
        onClick={this.handleFetchReport}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.exportGenerate)}
      </Button>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportSubmitOwnProps, ExportSubmitStateProps>((state, props) => {
  const { groupBy, isAllItems, items, query, reportPathsType, resolution, timeScope } = props;
  let { end_date, start_date } = getDateRange(query.dateRange);

  if (!(start_date && end_date)) {
    const isPrevious = timeScope === 'previous';
    const today = getToday();

    if (isPrevious) {
      today.setMonth(today.getMonth() - 1);
    }
    end_date = format(isPrevious ? endOfMonth(today) : today, 'yyyy-MM-dd');
    start_date = format(startOfMonth(today), 'yyyy-MM-dd');
  }

  // Todo: Add name and format type for "all exports" feature
  const getQueryString = () => {
    const newQuery: Query = {
      ...JSON.parse(JSON.stringify(query)),
      filter: {
        limit: undefined,
        offset: undefined,
        resolution: resolution ? resolution : undefined,
      },
      filter_by: {},
      limit: 0,
      order_by: undefined,
      perspective: undefined,
      dateRange: undefined,
      delta: undefined,
      start_date,
      end_date,
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
    endDate: end_date,
    isExportsFeatureEnabled: featureFlagsSelectors.selectIsExportsFeatureEnabled(state),
    queryString,
    report,
    reportError,
    reportFetchStatus,
    startDate: start_date,
  };
});

const mapDispatchToProps: ExportSubmitDispatchProps = {
  exportReport: exportActions.exportReport,
};

const ExportSubmitConnect = connect(mapStateToProps, mapDispatchToProps)(ExportSubmitBase);
const ExportSubmit = injectIntl(ExportSubmitConnect);

export { ExportSubmit, ExportSubmitProps };
