import { AlertVariant } from '@patternfly/react-core';
import type { Export } from 'api/export/export';
import { runExport } from 'api/export/exportUtils';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import type { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { getFetchId } from 'store/export/exportCommon';
import { selectExport, selectExportError, selectExportFetchStatus } from 'store/export/exportSelectors';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ExportActionMeta {
  fetchId: string;
  notification?: any;
}

export const fetchExportRequest = createAction('report/request')<ExportActionMeta>();
export const fetchExportSuccess = createAction('report/success')<Export, ExportActionMeta>();
export const fetchExportFailure = createAction('report/failure')<AxiosError, ExportActionMeta>();

const exportSuccessID = 'cost_management_export_success';

export function fetchExport(
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string,
  isExportsToggleEnabled: boolean = false
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isExportExpired(getState(), reportPathsType, reportType, reportQueryString)) {
      return;
    }

    const meta: ExportActionMeta = {
      fetchId: getFetchId(reportPathsType, reportType, reportQueryString),
    };

    dispatch(fetchExportRequest(meta));
    runExport(reportPathsType, reportType, reportQueryString)
      .then(res => {
        dispatch(
          fetchExportSuccess(res.data, {
            ...meta,
            ...(isExportsToggleEnabled && {
              notification: {
                dismissable: true,
                id: exportSuccessID,
                title: intl.formatMessage(messages.exportsSuccess),
                variant: AlertVariant.success,
              },
            }),
          })
        );
      })
      .catch(err => {
        dispatch(
          fetchExportFailure(err, {
            ...meta,
            ...(isExportsToggleEnabled && {
              notification: {
                description: intl.formatMessage(messages.exportsFailedDesc),
                dismissable: true,
                title: intl.formatMessage(messages.exportsUnavailable),
                variant: AlertVariant.danger,
              },
            }),
          })
        );
      });
  };
}

function isExportExpired(
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) {
  const report = selectExport(state, reportPathsType, reportType, reportQueryString);
  const fetchError = selectExportError(state, reportPathsType, reportType, reportQueryString);
  const fetchStatus = selectExportFetchStatus(state, reportPathsType, reportType, reportQueryString);
  if (fetchError || fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
