import type { ReportPathsType, ReportType } from 'api/reports/report';
import type { RootState } from 'store/rootReducer';

import { exportStateKey, getExportId } from './exportCommon';

export const selectExportState = (state: RootState) => state[exportStateKey];

export const selectExport = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
) => selectExportState(state).byId.get(getExportId(reportPathsType, reportType, query));

export const selectExportFetchStatus = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
) => selectExportState(state).fetchStatus.get(getExportId(reportPathsType, reportType, query));

export const selectExportError = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  query: string
) => selectExportState(state).errors.get(getExportId(reportPathsType, reportType, query));
