import { OcpReport, runReport } from 'api/reports/ocpReports';
import { ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { expirationMS, FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';
import { getReportId } from './ocpReportsCommon';
import { selectReport, selectReportFetchStatus } from './ocpReportsSelectors';

interface OcpReportActionMeta {
  reportId: string;
}

export const fetchOcpReportRequest = createStandardAction('ocpReports/request')<
  OcpReportActionMeta
>();
export const fetchOcpReportSuccess = createStandardAction('ocpReports/success')<
  OcpReport,
  OcpReportActionMeta
>();
export const fetchOcpReportFailure = createStandardAction('ocpReports/failure')<
  AxiosError,
  OcpReportActionMeta
>();

export function fetchReport(
  reportType: ReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, query)) {
      return;
    }

    const meta: OcpReportActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchOcpReportRequest(meta));
    runReport(reportType, query)
      .then(res => {
        // Todo: For testing purposes
        // dispatch(fetchOcpReportSuccess(test as any, meta));

        // See https://github.com/project-koku/koku-ui/pull/580
        // const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchOcpReportSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchOcpReportFailure(err, meta));
      });
  };
}

function isReportExpired(
  state: RootState,
  reportType: ReportType,
  query: string
) {
  const report = selectReport(state, reportType, query);
  const fetchStatus = selectReportFetchStatus(state, reportType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
