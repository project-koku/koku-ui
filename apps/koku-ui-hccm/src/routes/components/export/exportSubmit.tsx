import { Button, ButtonVariant } from '@patternfly/react-core';
import { type AccountSettingsData, AccountSettingsType } from 'api/accountSettings';
import type { Export, ExportPathsType, ExportType } from 'api/export/export';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
import { ExportsLink } from 'components/drawers';
import { isOnPremEnabled } from 'components/featureToggle';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import fileDownload from 'js-file-download';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getDateRangeFromQuery } from 'routes/utils/dateRange';
import { accountSettingsActions } from 'store/accountSettings';
import { accountSettingsSelectors } from 'store/accountSettings';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { exportActions, exportSelectors } from 'store/export';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { getToday } from 'utils/dates';
import type { Notification, NotificationComponentProps } from 'utils/notification';
import { withNotification } from 'utils/notification';
import { orgUnitIdKey, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

export interface ExportSubmitOwnProps extends NotificationComponentProps, RouterComponentProps, WrappedComponentProps {
  disabled?: boolean;
  dateFilter?: 'timeScope' | 'dateRange';
  exportPathsType: ExportPathsType;
  exportQueryString: string;
  exportType: ExportType;
  formatType: 'csv' | 'json';
  groupBy?: string;
  isAllItems?: boolean;
  items?: ComputedReportItem[];
  name?: string;
  onClose(isOpen: boolean);
  onError(error: AxiosError);
  resolution?: string;
  timeScopeValue?: number;
}

interface ExportSubmitDispatchProps {
  fetchAccountSettings?: typeof accountSettingsActions.fetchAccountSettings;
  fetchExport?: typeof exportActions.fetchExport;
}

interface ExportSubmitStateProps {
  accountSettings?: AccountSettingsData;
  accountSettingsError?: AxiosError;
  accountSettingsFetchStatus?: FetchStatus;
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
    this.updateReport();
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
    const { exportPathsType, exportQueryString, exportType, fetchExport, isExportsToggleEnabled } = this.props;

    fetchExport(exportPathsType, exportType, exportQueryString, isExportsToggleEnabled);

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
    const { endDate, exportPathsType, groupBy, intl, resolution, startDate } = this.props;

    // defaultMessage: '<provider>_<groupBy>_<resolution>_<start-date>_<end-date>',
    const fileName = intl.formatMessage(messages.exportFileName, {
      date: format(getToday(), 'yyyy-MM-dd'),
      endDate,
      provider: exportPathsType,
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

  private updateReport = () => {
    const { accountSettings, accountSettingsFetchStatus, fetchAccountSettings } = this.props;

    if (isOnPremEnabled && !accountSettings && accountSettingsFetchStatus !== FetchStatus.inProgress) {
      fetchAccountSettings(AccountSettingsType.dataRetention);
    }
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
    dateFilter,
    exportPathsType,
    exportQueryString: pageQueryString,
    exportType,
    groupBy,
    isAllItems,
    items,
    resolution,
    router,
    timeScopeValue,
  } = props;

  const isPrevious = timeScopeValue === -2;
  const queryFromRoute = parseQuery<Query>(router.location.search);

  // Data retention

  const accountSettings = accountSettingsSelectors.selectAccountSettings(
    state,
    AccountSettingsType.dataRetention
  ) as AccountSettingsData;
  const accountSettingsError = accountSettingsSelectors.selectAccountSettingsError(
    state,
    AccountSettingsType.dataRetention
  );
  const accountSettingsFetchStatus = accountSettingsSelectors.selectAccountSettingsFetchStatus(
    state,
    AccountSettingsType.dataRetention
  );

  const getDateRange = () => {
    if (queryFromRoute.dateRangeType) {
      return getDateRangeFromQuery(queryFromRoute, accountSettings?.data_retention_months, false);
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
    const pageQuery = parseQuery(pageQueryString);
    const newQuery: Query = {
      ...pageQuery,
      delta: undefined, // Don't want cost delta percentage
      filter: {
        ...(pageQuery.filter ? pageQuery.filter : {}),
        limit: undefined, // Don't want paginated data
        offset: undefined, // Don't want a specific page
        time_scope_units: undefined, // Omitted for export?
        time_scope_value: undefined, // Set below when dateFilter is timeScope
        resolution: dateFilter && resolution ? resolution : undefined, // Only with dateFilter (report exports)
        ...(dateFilter === 'timeScope' && { time_scope_value: isPrevious ? -2 : -1 }),
      },
      filter_by: {}, // Don't want page filter, selected items will be filtered below
      limit: 0, // No limit to number of items returned
      offset: undefined,
      order_by: undefined, // Don't want items sorted by cost
      ...(dateFilter === 'dateRange' && {
        start_date,
        end_date,
      }),
    };

    // Store filter_by as an array, so we can add to it below
    const addFilterByValue = (key: string, value) => {
      if (value === undefined || value === null) {
        return;
      }
      if (newQuery.filter_by[key] === undefined) {
        newQuery.filter_by[key] = [];
      }
      const values = Array.isArray(value) ? value : [value];
      for (const val of values) {
        if (!newQuery.filter_by[key].includes(val)) {
          newQuery.filter_by[key].push(val);
        }
      }
    };

    if (queryFromRoute.filter_by) {
      for (const key of Object.keys(queryFromRoute.filter_by)) {
        // Selected rows define the group_by filter; keep other page filters (e.g. cluster)
        if (!isAllItems && key === groupBy) {
          continue;
        }
        addFilterByValue(key, queryFromRoute.filter_by[key]);
      }
    }

    if (isAllItems) {
      // Ensure group_by isn't overridden -- org_unit_id is not unique
      if (groupBy === orgUnitIdKey) {
        addFilterByValue(orgUnitIdKey, queryFromRoute.group_by[orgUnitIdKey]);
      }
    } else {
      if (groupBy === orgUnitIdKey) {
        for (const item of items) {
          // Note that type only exists when grouping by org units
          const type = item.type === 'organizational_unit' ? orgUnitIdKey : item.type;
          addFilterByValue(type, item.id);
        }
      } else {
        for (const item of items) {
          addFilterByValue(groupBy, item.id);
        }
      }
    }

    // pageQueryString is built via getQuery(), which already converts page filter_by
    // values into filter. Clear those keys so convertFilterBy does not emit duplicates
    // or retain unselected group_by filter values from the page.
    const filterKeysToReplace = new Set(Object.keys(newQuery.filter_by));
    if (!isAllItems && groupBy) {
      filterKeysToReplace.add(groupBy);
    }
    for (const key of filterKeysToReplace) {
      if (newQuery.filter?.[key] !== undefined) {
        newQuery.filter[key] = undefined;
      }
    }

    return getQuery(newQuery);
  };

  const exportQueryString = getQueryString();
  const exportReport = exportSelectors.selectExport(state, exportPathsType, exportType, exportQueryString);
  const exportError = exportSelectors.selectExportError(state, exportPathsType, exportType, exportQueryString);
  const exportFetchNotification = exportSelectors.selectExportFetchNotification(
    state,
    exportPathsType,
    exportType,
    exportQueryString
  );
  const exportFetchStatus = exportSelectors.selectExportFetchStatus(
    state,
    exportPathsType,
    exportType,
    exportQueryString
  );

  return {
    accountSettings,
    accountSettingsError,
    accountSettingsFetchStatus,
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
  fetchAccountSettings: accountSettingsActions.fetchAccountSettings,
  fetchExport: exportActions.fetchExport,
};

const ExportSubmitConnect = connect(mapStateToProps, mapDispatchToProps)(ExportSubmitBase);
const ExportSubmit = injectIntl(withNotification(withRouter(ExportSubmitConnect)));

export { ExportSubmit };
export type { ExportSubmitProps };
