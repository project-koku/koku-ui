import { Button, ButtonVariant } from '@patternfly/react-core';
import type { Export } from 'api/export/export';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { parseQuery } from 'api/queries/ocpQuery';
import type { Query } from 'api/queries/query';
import { getQuery, orgUnitIdKey, tagPrefix } from 'api/queries/query';
import type { ReportPathsType } from 'api/reports/report';
import { ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import fileDownload from 'js-file-download';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getDateRangeFromQuery } from 'routes/views/utils/dateRange';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { exportActions, exportSelectors } from 'store/export';
import { featureFlagsSelectors } from 'store/featureFlags';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getToday } from 'utils/dates';

export interface ExportSubmitOwnProps {
  disabled?: boolean;
  formatType: 'csv' | 'json';
  groupBy?: string;
  isAllItems?: boolean;
  items?: ComputedReportItem[];
  name?: string;
  onClose(isOpen: boolean);
  onError(error: AxiosError);
  queryString: string;
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
  report: Export;
  reportError: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString: string;
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
    const { exportReport, isExportsFeatureEnabled, reportPathsType, reportQueryString } = this.props;

    exportReport(reportPathsType, reportType, reportQueryString, isExportsFeatureEnabled);

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
        ouiaId="submit-btn"
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
  const { groupBy, isAllItems, items, queryString, reportPathsType, resolution, timeScope } = props;

  const queryFromRoute = parseQuery<OcpQuery>(location.search);
  const getStartEndDate = () => {
    if (queryFromRoute.dateRangeType) {
      return getDateRangeFromQuery(queryFromRoute);
    } else {
      const isPrevious = timeScope === 'previous';
      const today = getToday();

      if (isPrevious) {
        today.setMonth(today.getMonth() - 1);
      }
      return {
        end_date: format(isPrevious ? endOfMonth(today) : today, 'yyyy-MM-dd'),
        start_date: format(startOfMonth(today), 'yyyy-MM-dd'),
      };
    }
  };
  const { end_date, start_date } = getStartEndDate();

  const getQueryString = () => {
    const parsedQuery = parseQuery(queryString);
    const newQuery: Query = {
      ...parsedQuery,
      delta: undefined, // Don't want cost delta percentage
      filter: {
        limit: undefined, // Don't want paginated data
        offset: undefined, // Don't want a page
        resolution: resolution ? resolution : undefined, // Resolution is defined by export modal
      },
      filter_by: {}, // Don't want page filter, selected items will be filtered below
      limit: 0, // No limit to number of items returned
      order_by: undefined, // Don't want items sorted by cost
      start_date,
      end_date,
    };

    // Store filter_by as an array, so we can add to it below
    if (queryFromRoute.filter_by) {
      for (const key of Object.keys(queryFromRoute.filter_by)) {
        if (newQuery.filter_by[key] === undefined) {
          newQuery.filter_by[key] = [];
        }
        newQuery.filter_by[key].push(queryFromRoute.filter_by[key]);
      }
    }

    if (isAllItems) {
      // Ensure group_by isn't overridden -- org_unit_id is not unique
      if (groupBy === orgUnitIdKey) {
        if (newQuery.filter_by[orgUnitIdKey] === undefined) {
          newQuery.filter_by[orgUnitIdKey] = [];
        }
        newQuery.filter_by[orgUnitIdKey].push(queryFromRoute.group_by[orgUnitIdKey]);
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

  const reportQueryString = getQueryString();
  const report = exportSelectors.selectExport(state, reportPathsType, reportType, reportQueryString);
  const reportError = exportSelectors.selectExportError(state, reportPathsType, reportType, reportQueryString);
  const reportFetchStatus = exportSelectors.selectExportFetchStatus(
    state,
    reportPathsType,
    reportType,
    reportQueryString
  );

  return {
    endDate: end_date,
    isExportsFeatureEnabled: featureFlagsSelectors.selectIsExportsFeatureEnabled(state),
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
    startDate: start_date,
  };
});

const mapDispatchToProps: ExportSubmitDispatchProps = {
  exportReport: exportActions.exportReport,
};

const ExportSubmitConnect = connect(mapStateToProps, mapDispatchToProps)(ExportSubmitBase);
const ExportSubmit = injectIntl(ExportSubmitConnect);

export { ExportSubmit };
export type { ExportSubmitProps };
