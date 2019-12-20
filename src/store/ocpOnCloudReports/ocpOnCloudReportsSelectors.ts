import { OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import { RootState } from 'store/rootReducer';
import {
  getReportId,
  ocpOnCloudReportsStateKey,
} from './ocpOnCloudReportsCommon';

export const selectReportsState = (state: RootState) =>
  state[ocpOnCloudReportsStateKey];

export const selectReport = (
  state: RootState,
  reportType: OcpOnCloudReportType,
  query: string
) => selectReportsState(state).byId.get(getReportId(reportType, query));

export const selectReportFetchStatus = (
  state: RootState,
  reportType: OcpOnCloudReportType,
  query: string
) => selectReportsState(state).fetchStatus.get(getReportId(reportType, query));

export const selectReportError = (
  state: RootState,
  reportType: OcpOnCloudReportType,
  query: string
) => selectReportsState(state).errors.get(getReportId(reportType, query));
