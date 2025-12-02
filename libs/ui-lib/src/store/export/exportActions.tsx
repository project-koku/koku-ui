import type { Export } from '@koku-ui/api/export/export';
import { runExport } from '@koku-ui/api/export/exportUtils';
import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { AlertVariant } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'redux-thunk';
import { createAction } from 'typesafe-actions';

import { FetchStatus } from '../common';
import type { RootState } from '../rootReducer';
import { getFetchId } from './exportCommon';
import { selectExport, selectExportError, selectExportFetchStatus } from './exportSelectors';

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
