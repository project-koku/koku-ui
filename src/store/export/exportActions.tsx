import { AlertVariant } from '@patternfly/react-core';
import { addNotification, removeNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { Export } from 'api/export/export';
import { runExport } from 'api/export/exportUtils';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ExportsLink } from 'components/exports/exportsLink';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { getExportId } from 'store/export/exportCommon';
import { selectExport, selectExportFetchStatus } from 'store/export/exportSelectors';
import { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';
import { FeatureType, isFeatureVisible } from 'utils/feature';

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
  query: string
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

        /* Todo: Show in-progress features in beta environment only */
        if (isFeatureVisible(FeatureType.exports)) {
          const description = intl.formatMessage(messages.ExportsSuccessDesc, {
            link: <ExportsLink isActionLink onClick={() => dispatch(removeNotification(exportSuccessID))} />,
            value: <b>{intl.formatMessage(messages.ExportsTitle)}</b>,
          });

          dispatch(
            addNotification({
              description,
              dismissable: true,
              id: exportSuccessID,
              title: intl.formatMessage(messages.ExportsSuccess),
              variant: AlertVariant.success,
            })
          );
        }
      })
      .catch(err => {
        dispatch(fetchExportFailure(err, meta));

        /* Todo: Show in-progress features in beta environment only */
        if (isFeatureVisible(FeatureType.exports)) {
          dispatch(
            addNotification({
              description: intl.formatMessage(messages.ExportsFailedDesc),
              dismissable: true,
              title: intl.formatMessage(messages.ExportsUnavailable),
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
