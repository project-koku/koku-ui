import { Export } from 'api/exports/export';
import { runExport } from 'api/exports/exportUtils';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { getExportId } from 'store/exports/exportCommon';
import {
  selectExport,
  selectExportFetchStatus,
} from 'store/exports/exportSelectors';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ExportActionMeta {
  reportId: string;
}

export const fetchExportRequest = createStandardAction('report/request')<
  ExportActionMeta
>();
export const fetchExportSuccess = createStandardAction('report/success')<
  Export,
  ExportActionMeta
>();
export const fetchExportFailure = createStandardAction('report/failure')<
  AxiosError,
  ExportActionMeta
>();

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
      })
      .catch(err => {
        dispatch(fetchExportFailure(err, meta));
      });
  };
}

function isExportExpired(
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
) {
  const report = selectExport(state, reportPathsType, reportType, query);
  const fetchStatus = selectExportFetchStatus(
    state,
    reportPathsType,
    reportType,
    query
  );
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
