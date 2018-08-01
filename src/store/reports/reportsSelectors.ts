import { ReportType } from 'api/reports';
import { RootState } from '../rootReducer';
import { getReportId, reportsStateKey } from './reportsCommon';

export const selectReportsState = (state: RootState) => state[reportsStateKey];

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
