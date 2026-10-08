import { AlertVariant } from '@patternfly/react-core';
import type { Export, ExportPathsType, ExportType } from 'api/export/export';
import { runExport } from 'api/export/exportUtils';
import { SettingsType } from 'api/settings';
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
  exportPathsType: ExportPathsType,
  exportType: ExportType,
  exportQueryString: string,
  isExportsToggleEnabled: boolean = false
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isExportExpired(getState(), exportPathsType, exportType, exportQueryString)) {
      return;
    }

    const meta: ExportActionMeta = {
      fetchId: getFetchId(exportPathsType, exportType, exportQueryString),
    };

    dispatch(fetchExportRequest(meta));
    runExport(exportPathsType, exportType, exportQueryString)
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
  exportPathsType: ExportPathsType,
  exportType: ExportType,
  exportQueryString: string
) {
  const fetchStatus = selectExportFetchStatus(state, exportPathsType, exportType, exportQueryString);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  // Static rates change without changing the export query string
  if (exportPathsType === SettingsType.currency) {
    return true;
  }

  const report = selectExport(state, exportPathsType, exportType, exportQueryString);
  const fetchError = selectExportError(state, exportPathsType, exportType, exportQueryString);
  if (fetchError) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
