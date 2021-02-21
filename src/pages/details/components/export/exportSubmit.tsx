import { Button, ButtonVariant } from '@patternfly/react-core';
import { Export } from 'api/exports/export';
import { getQuery, orgUnitIdKey, Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import fileDownload from 'js-file-download';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { exportActions, exportSelectors } from 'store/exports';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

export interface ExportSubmitOwnProps extends WithTranslation {
  groupBy?: string;
  isAllItems?: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  query?: Query;
  reportPathsType: ReportPathsType;
  resolution: string;
  timeScope: number;
  useDateRange?: boolean; // resolution and timeScope filters are not valid with date range
}

interface ExportSubmitStateProps {
  // TBD...
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

type ExportSubmitProps = ExportSubmitOwnProps & ExportSubmitDispatchProps & ExportSubmitStateProps & WithTranslation;

const reportType = ReportType.cost;

export class ExportSubmitBase extends React.Component<ExportSubmitProps> {
  protected defaultState: ExportSubmitState = {
    fetchReportClicked: false,
  };
  public state: ExportSubmitState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleResolutionChange = this.handleResolutionChange.bind(this);
  }

  public componentDidUpdate(prevProps: ExportSubmitProps) {
    const { report } = this.props;
    const { fetchReportClicked } = this.state;

    if (prevProps.report !== report && fetchReportClicked) {
      this.getExport();
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
    const { groupBy, reportPathsType, t } = this.props;

    const fileName = t('export.file_name', {
      provider: reportPathsType,
      groupBy,
      date: format(new Date(), 'yyyy-MM-dd'),
    });

    return `${fileName}.csv`;
  };

  private handleClose = () => {
    this.props.onClose(false);
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

  public handleResolutionChange = (_, event) => {
    this.setState({ resolution: event.currentTarget.value });
  };

  public render() {
    const { reportFetchStatus, t } = this.props;

    return (
      <Button
        {...getTestProps(testIds.export.submit_btn)}
        isDisabled={reportFetchStatus === FetchStatus.inProgress}
        key="confirm"
        onClick={this.handleFetchReport}
        variant={ButtonVariant.primary}
      >
        {t('export.confirm')}
      </Button>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportSubmitOwnProps, ExportSubmitStateProps>((state, props) => {
  const { groupBy, isAllItems, items, query, reportPathsType, resolution, timeScope = -1, useDateRange } = props;

  const getQueryString = () => {
    const newQuery: Query = {
      ...JSON.parse(JSON.stringify(query)),
      filter: {
        limit: undefined,
        offset: undefined,
        resolution: !useDateRange ? resolution : undefined,
        time_scope_value: !useDateRange ? timeScope : undefined,
      },
      filter_by: {},
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
const ExportSubmit = withTranslation()(ExportSubmitConnect);

export { ExportSubmit, ExportSubmitProps };
