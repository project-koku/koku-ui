import { AzureReportType } from 'api/reports/azureReports';
import { RootState } from 'store/rootReducer';
import { azureReportsStateKey, getReportId } from './azureReportsCommon';

export const selectReportsState = (state: RootState) =>
  state[azureReportsStateKey];

export const selectReport = (
  state: RootState,
  reportType: AzureReportType,
  query: string
) => selectReportsState(state).byId.get(getReportId(reportType, query));

export const selectReportFetchStatus = (
  state: RootState,
  reportType: AzureReportType,
  query: string
) => selectReportsState(state).fetchStatus.get(getReportId(reportType, query));

export const selectReportError = (
  state: RootState,
  reportType: AzureReportType,
  query: string
) => selectReportsState(state).errors.get(getReportId(reportType, query));
