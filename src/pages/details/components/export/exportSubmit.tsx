import { Button, ButtonVariant } from '@patternfly/react-core';
import { Export } from 'api/exports/export';
import { getQuery, Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import formatDate from 'date-fns/format';
import fileDownload from 'js-file-download';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { exportActions, exportSelectors } from 'store/exports';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

export interface ExportSubmitOwnProps extends WrappedComponentProps {
  groupBy?: string;
  isAllItems?: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  query?: Query;
  reportPathsType: ReportPathsType;
  resolution: string;
}

interface ExportSubmitStateProps {
  queryString: string;
  report: Export;
  reportError: AxiosError;
  reportFetchStatus?: FetchStatus;
}

interface ExportSubmitDispatchProps {
  exportReport?: typeof exportActions.exportReport;
}

interface ExportSubmitState {
  fetchReportClicked: boolean;
}

type ExportSubmitProps = ExportSubmitOwnProps &
  ExportSubmitStateProps &
  ExportSubmitDispatchProps &
  WrappedComponentProps;

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
    const { groupBy, reportPathsType, intl } = this.props;

    const fileName = intl.formatMessage(
      { id: 'export.file_name' },
      {
        provider: reportPathsType,
        groupBy,
        date: formatDate(new Date(), 'YYYY-MM-DD'),
      }
    );

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
    const { reportFetchStatus, intl } = this.props;

    return (
      <Button
        {...getTestProps(testIds.export.submit_btn)}
        isDisabled={reportFetchStatus === FetchStatus.inProgress}
        key="confirm"
        onClick={this.handleFetchReport}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage({ id: 'export.confirm' })}
      </Button>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  ExportSubmitOwnProps,
  ExportSubmitStateProps
>((state, props) => {
  const {
    groupBy,
    isAllItems,
    items,
    query,
    reportPathsType,
    resolution,
  } = props;

  const getQueryString = () => {
    const newQuery: Query = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: undefined,
      order_by: undefined,
    };
    newQuery.filter.resolution = resolution as any;
    let newQueryString = getQuery(newQuery);

    if (isAllItems) {
      newQueryString += `&group_by[${groupBy}]=*`;
    } else {
      for (const item of items) {
        newQueryString += `&group_by[${groupBy}]=` + item.label;
      }
    }
    return newQueryString;
  };

  const queryString = getQueryString();
  const report = exportSelectors.selectExport(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportError = exportSelectors.selectExportError(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportFetchStatus = exportSelectors.selectExportFetchStatus(
    state,
    reportPathsType,
    reportType,
    queryString
  );

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

const ExportSubmit = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ExportSubmitBase)
);

export { ExportSubmit, ExportSubmitProps };
