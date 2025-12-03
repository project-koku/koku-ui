import type { Export } from '@koku-ui/api/export/export';
import type { Query } from '@koku-ui/api/queries/query';
import { parseQuery } from '@koku-ui/api/queries/query';
import { getQuery } from '@koku-ui/api/queries/query';
import type { ReportPathsType } from '@koku-ui/api/reports/report';
import type { ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import fileDownload from 'js-file-download';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { ExportsLink } from '../../../components/drawers';
import { createMapStateToProps, FetchStatus } from '../../../store/common';
import { exportActions, exportSelectors } from '../../../store/export';
import { FeatureToggleSelectors } from '../../../store/featureToggle';
import { getToday } from '../../../utils/dates';
import type { Notification, NotificationComponentProps } from '../../../utils/notification';
import { withNotification } from '../../../utils/notification';
import { orgUnitIdKey, tagPrefix } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { getDateRangeFromQuery } from '../../utils/dateRange';

export interface ExportSubmitOwnProps extends NotificationComponentProps, RouterComponentProps, WrappedComponentProps {
  disabled?: boolean;
  formatType: 'csv' | 'json';
  groupBy?: string;
  isAllItems?: boolean;
  items?: ComputedReportItem[];
  isTimeScoped?: boolean;
  name?: string;
  onClose(isOpen: boolean);
  onError(error: AxiosError);
  reportPathsType: ReportPathsType;
  reportQueryString: string;
  reportType: ReportType;
  resolution: string;
  timeScopeValue?: number;
}

interface ExportSubmitDispatchProps {
  fetchExport?: typeof exportActions.fetchExport;
}

interface ExportSubmitStateProps {
  endDate: string;
  exportError: AxiosError;
  exportFetchStatus?: FetchStatus;
  exportFetchNotification?: Notification;
  exportQueryString: string;
  exportReport: Export;
  isExportsToggleEnabled?: boolean;
  startDate: string;
}

interface ExportSubmitState {
  fetchExportClicked: boolean;
}

type ExportSubmitProps = ExportSubmitOwnProps & ExportSubmitDispatchProps & ExportSubmitStateProps;

export class ExportSubmitBase extends React.Component<ExportSubmitProps, ExportSubmitState> {
  protected defaultState: ExportSubmitState = {
    fetchExportClicked: false,
  };
  public state: ExportSubmitState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
  }

  public componentDidUpdate(prevProps: ExportSubmitProps) {
    const { exportError, exportFetchNotification, exportReport, exportFetchStatus, intl, notification } = this.props;
    const { fetchExportClicked } = this.state;

    if (prevProps.exportReport !== exportReport && fetchExportClicked) {
      this.getExport();
    }

    if (prevProps.exportError !== exportError) {
      this.props.onError(exportError);
    }

    if (
      exportFetchNotification &&
      ((prevProps.exportFetchStatus !== exportFetchStatus && exportFetchStatus === FetchStatus.complete) ||
        (exportError && prevProps.exportError !== exportError))
    ) {
      notification.addNotification({
        ...exportFetchNotification,
        ...(!exportError && {
          description: intl.formatMessage(messages.exportsSuccessDesc, {
            link: <ExportsLink isActionLink onClick={() => notification.clearNotifications()} />,
            value: <b>{intl.formatMessage(messages.exportsTitle)}</b>,
          }),
        }),
      } as any);
    }
  }

  private fetchExport = () => {
    const { exportQueryString, fetchExport, isExportsToggleEnabled, reportPathsType, reportType } = this.props;

    fetchExport(reportPathsType, reportType, exportQueryString, isExportsToggleEnabled);

    this.setState(
      {
        fetchExportClicked: true,
      },
      () => {
        this.getExport();
      }
    );
  };

  private getExport = () => {
    const { exportFetchStatus, exportReport } = this.props;

    if (exportReport && exportFetchStatus === FetchStatus.complete) {
      fileDownload(exportReport.data, this.getFileName(), 'text/csv');
      this.handleOnClose();
    }
  };

  private getFileName = () => {
    const { endDate, groupBy, intl, reportPathsType, resolution, startDate } = this.props;

    // defaultMessage: '<provider>_<groupBy>_<resolution>_<start-date>_<end-date>',
    const fileName = intl.formatMessage(messages.exportFileName, {
      endDate,
      provider: reportPathsType,
      groupBy: groupBy && groupBy.indexOf(tagPrefix) !== -1 ? 'tag' : groupBy,
      resolution,
      startDate,
    });

    return `${fileName}.csv`;
  };

  private handleOnClose = () => {
    const { exportError } = this.props;

    this.setState({ ...this.defaultState }, () => {
      if (!exportError) {
        this.props.onClose(false);
      }
    });
  };

  public render() {
    const { disabled, exportFetchStatus, intl } = this.props;

    return (
      <Button
        ouiaId="submit-btn"
        isDisabled={disabled || exportFetchStatus === FetchStatus.inProgress}
        key="confirm"
        onClick={this.fetchExport}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.exportGenerate)}
      </Button>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportSubmitOwnProps, ExportSubmitStateProps>((state, props) => {
  const {
    groupBy,
    isAllItems,
    isTimeScoped,
    items,
    reportPathsType,
    reportQueryString,
    reportType,
    resolution,
    router,
    timeScopeValue,
  } = props;

  const isPrevious = timeScopeValue === -2;
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const getDateRange = () => {
    if (queryFromRoute.dateRangeType) {
      return getDateRangeFromQuery(queryFromRoute);
    } else {
      const today = getToday();

      if (isPrevious) {
        today.setDate(1); // Workaround to decrement month properly
        today.setMonth(today.getMonth() - 1);
      }
      return {
        end_date: format(isPrevious ? endOfMonth(today) : today, 'yyyy-MM-dd'),
        start_date: format(startOfMonth(today), 'yyyy-MM-dd'),
      };
    }
  };
  const { end_date, start_date } = getDateRange();

  const getQueryString = () => {
    const reportQuery = parseQuery(reportQueryString);
    const newQuery: Query = {
      ...reportQuery,
      delta: undefined, // Don't want cost delta percentage
      filter: {
        ...(reportQuery.filter ? reportQuery.filter : {}),
        limit: undefined, // Don't want paginated data
        offset: undefined, // Don't want a specific page
        time_scope_units: undefined, // Omitted for export?
        time_scope_value: undefined, // Not used with start and end date, use isTimeScoped
        resolution: resolution ? resolution : undefined, // Resolution is defined by export modal
        ...(isTimeScoped && { time_scope_value: isPrevious ? -2 : -1 }),
      },
      filter_by: {}, // Don't want page filter, selected items will be filtered below
      limit: 0, // No limit to number of items returned
      offset: undefined,
      order_by: undefined, // Don't want items sorted by cost
      ...(!isTimeScoped && {
        start_date,
        end_date,
      }),
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

  const exportQueryString = getQueryString();
  const exportReport = exportSelectors.selectExport(state, reportPathsType, reportType, exportQueryString);
  const exportError = exportSelectors.selectExportError(state, reportPathsType, reportType, exportQueryString);
  const exportFetchNotification = exportSelectors.selectExportFetchNotification(
    state,
    reportPathsType,
    reportType,
    exportQueryString
  );
  const exportFetchStatus = exportSelectors.selectExportFetchStatus(
    state,
    reportPathsType,
    reportType,
    exportQueryString
  );

  return {
    endDate: end_date,
    exportError,
    exportFetchNotification,
    exportFetchStatus,
    exportQueryString,
    exportReport,
    isExportsToggleEnabled: FeatureToggleSelectors.selectIsExportsToggleEnabled(state),
    startDate: start_date,
  };
});

const mapDispatchToProps: ExportSubmitDispatchProps = {
  fetchExport: exportActions.fetchExport,
};

const ExportSubmitConnect = connect(mapStateToProps, mapDispatchToProps)(ExportSubmitBase);
const ExportSubmit = injectIntl(withNotification(withRouter(ExportSubmitConnect)));

export { ExportSubmit };
export type { ExportSubmitProps };
