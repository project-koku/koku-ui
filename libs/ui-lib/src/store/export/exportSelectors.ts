import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

import type { RootState } from '../rootReducer';
import { exportStateKey, getFetchId } from './exportCommon';

export const selectExportState = (state: RootState) => state[exportStateKey];

export const selectExport = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) => selectExportState(state).byId.get(getFetchId(reportPathsType, reportType, reportQueryString));

export const selectExportError = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) => selectExportState(state).errors.get(getFetchId(reportPathsType, reportType, reportQueryString));

export const selectExportFetchNotification = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) => selectExportState(state).notification?.get(getFetchId(reportPathsType, reportType, reportQueryString));

export const selectExportFetchStatus = (
  state: RootState,
  reportPathsType: ReportPathsType,
  reportType: ReportType,
  reportQueryString: string
) => selectExportState(state).fetchStatus.get(getFetchId(reportPathsType, reportType, reportQueryString));
