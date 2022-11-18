import { AlertVariant } from '@patternfly/react-core';
import { addNotification, removeNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import type { Export } from 'api/export/export';
import { runExport } from 'api/export/exportUtils';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import { ExportsLink } from 'components/exports';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { getFetchId } from 'store/export/exportCommon';
import { selectExport, selectExportFetchStatus } from 'store/export/exportSelectors';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ExportActionMeta {
  fetchId: string;
}

export const fetchExportRequest = createAction('report/request')<ExportActionMeta>();
export const fetchExportSuccess = createAction('report/success')<Export, ExportActionMeta>();
export const fetchExportFailure = createAction('report/failure')<AxiosError, ExportActionMeta>();

const exportSuccessID = 'cost_management_export_success';

export function fetchExport(
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string,
  isExportsFeatureEnabled: boolean = false
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
        dispatch(fetchExportSuccess(res.data, meta));

        if (isExportsFeatureEnabled) {
          const description = intl.formatMessage(messages.exportsSuccessDesc, {
            link: <ExportsLink isActionLink onClick={() => dispatch(removeNotification(exportSuccessID))} />,
            value: <b>{intl.formatMessage(messages.exportsTitle)}</b>,
          });

          dispatch(
            addNotification({
              description,
              dismissable: true,
              id: exportSuccessID,
              title: intl.formatMessage(messages.exportsSuccess),
              variant: AlertVariant.success,
            })
          );
        }
      })
      .catch(err => {
        dispatch(fetchExportFailure(err, meta));

        if (isExportsFeatureEnabled) {
          dispatch(
            addNotification({
              description: intl.formatMessage(messages.exportsFailedDesc),
              dismissable: true,
              title: intl.formatMessage(messages.exportsUnavailable),
              variant: AlertVariant.danger,
            })
          );
        }
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
  const fetchStatus = selectExportFetchStatus(state, reportPathsType, reportType, reportQueryString);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
