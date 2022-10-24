import { AlertVariant } from '@patternfly/react-core';
import { addNotification, removeNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import type { Export } from 'api/export/export';
import { runExport } from 'api/export/exportUtils';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ExportsLink } from 'components/exports';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { getExportId } from 'store/export/exportCommon';
import { selectExport, selectExportFetchStatus } from 'store/export/exportSelectors';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ExportActionMeta {
  reportId: string;
}

export const fetchExportRequest = createAction('report/request')<ExportActionMeta>();
export const fetchExportSuccess = createAction('report/success')<Export, ExportActionMeta>();
export const fetchExportFailure = createAction('report/failure')<AxiosError, ExportActionMeta>();

const exportSuccessID = 'cost_management_export_success';

export function exportReport(
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string,
  isExportsFeatureEnabled: boolean
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isExportExpired(getState(), reportPathsType, reportType, query)) {
      return;
    }

    const meta: ExportActionMeta = {
      reportId: getExportId(reportPathsType, reportType, query),
    };

    dispatch(fetchExportRequest(meta));
    runExport(reportPathsType, reportType, query)
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

function isExportExpired(state: RootState, reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  const report = selectExport(state, reportPathsType, reportType, query);
  const fetchStatus = selectExportFetchStatus(state, reportPathsType, reportType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
