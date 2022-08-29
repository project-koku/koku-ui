import { ReportType } from 'api/reports/report';
import { RootState } from 'store/rootReducer';
import { awsReportsStateKey, getReportId } from './awsReportsCommon';

export const selectReportsState = (state: RootState) =>
  state[awsReportsStateKey];

export const selectReport = (
  state: RootState,
  reportType: ReportType,
  query: string
) => selectReportsState(state).byId.get(getReportId(reportType, query));

export const selectReportFetchStatus = (
  state: RootState,
  reportType: ReportType,
  query: string
) => selectReportsState(state).fetchStatus.get(getReportId(reportType, query));

export const selectReportError = (
  state: RootState,
  reportType: ReportType,
  query: string
) => selectReportsState(state).errors.get(getReportId(reportType, query));
