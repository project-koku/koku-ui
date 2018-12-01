import { OcpReport, OcpReportType, runReport } from 'api/ocpReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { createStandardAction } from 'typesafe-actions';
import { FetchStatus } from '../common';
import { RootState } from '../rootReducer';
import { getReportId } from './ocpReportsCommon';
import { selectReport, selectReportFetchStatus } from './ocpReportsSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

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
  reportType: OcpReportType,
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
        dispatch(fetchOcpReportSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchOcpReportFailure(err, meta));
      });
  };
}

function isReportExpired(
  state: RootState,
  reportType: OcpReportType,
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

// Todo: For testing purposes
export const test = {
  group_by: {
    project: ['*'],
  },
  filter: {
    resolution: 'daily',
    time_scope_value: '-1',
    time_scope_units: 'month',
    limit: 5,
  },
  delta: {
    value: 720.419149,
    percent: 0.0,
  },
  data: [
    {
      date: '2018-11-01',
      projects: [],
    },
    {
      date: '2018-11-02',
      projects: [],
    },
    {
      date: '2018-11-03',
      projects: [],
    },
    {
      date: '2018-11-04',
      projects: [],
    },
    {
      date: '2018-11-05',
      projects: [],
    },
    {
      date: '2018-11-06',
      projects: [],
    },
    {
      date: '2018-11-07',
      projects: [],
    },
    {
      date: '2018-11-08',
      projects: [],
    },
    {
      date: '2018-11-09',
      projects: [],
    },
    {
      date: '2018-11-10',
      projects: [],
    },
    {
      date: '2018-11-11',
      projects: [],
    },
    {
      date: '2018-11-12',
      projects: [
        {
          project: 'metering-hccm',
          values: [
            {
              date: '2018-11-12',
              project: 'metering-hccm',
              usage: 68.077947,
              request: 73.758741,
              charge: 1.842057,
              limit: null,
              delta_value: 68.077947,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'monitoring',
          values: [
            {
              date: '2018-11-12',
              project: 'monitoring',
              usage: 29.466864,
              request: 44.040213,
              charge: 1.159095,
              limit: null,
              delta_value: 29.466864,
              delta_percent: 0.0,
            },
          ],
        },
      ],
    },
    {
      date: '2018-11-13',
      projects: [
        {
          project: 'metering-hccm',
          values: [
            {
              date: '2018-11-13',
              project: 'metering-hccm',
              usage: 67.273899,
              request: 72.857904,
              charge: 1.800939,
              limit: null,
              delta_value: 67.273899,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'monitoring',
          values: [
            {
              date: '2018-11-13',
              project: 'monitoring',
              usage: 29.094975,
              request: 44.009616,
              charge: 1.148847,
              limit: null,
              delta_value: 29.094975,
              delta_percent: 0.0,
            },
          ],
        },
      ],
    },
    {
      date: '2018-11-14',
      projects: [
        {
          project: 'metering-hccm',
          values: [
            {
              date: '2018-11-14',
              project: 'metering-hccm',
              usage: 67.252164,
              request: 72.908535,
              charge: 1.798797,
              limit: null,
              delta_value: 67.252164,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'monitoring',
          values: [
            {
              date: '2018-11-14',
              project: 'monitoring',
              usage: 29.267343,
              request: 44.040213,
              charge: 1.15794,
              limit: null,
              delta_value: 29.267343,
              delta_percent: 0.0,
            },
          ],
        },
      ],
    },
    {
      date: '2018-11-15',
      projects: [],
    },
    {
      date: '2018-11-16',
      projects: [],
    },
    {
      date: '2018-11-17',
      projects: [],
    },
    {
      date: '2018-11-18',
      projects: [],
    },
    {
      date: '2018-11-19',
      projects: [],
    },
    {
      date: '2018-11-20',
      projects: [],
    },
    {
      date: '2018-11-21',
      projects: [],
    },
    {
      date: '2018-11-22',
      projects: [],
    },
    {
      date: '2018-11-23',
      projects: [],
    },
    {
      date: '2018-11-24',
      projects: [],
    },
    {
      date: '2018-11-25',
      projects: [],
    },
    {
      date: '2018-11-26',
      projects: [
        {
          project: 'metering-koku',
          values: [
            {
              date: '2018-11-26',
              project: 'metering-koku',
              usage: 64.874061,
              request: 106.853838,
              charge: 2.56452,
              limit: 138.544455,
              delta_value: 64.874061,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'metering-hccm',
          values: [
            {
              date: '2018-11-26',
              project: 'metering-hccm',
              usage: 61.6518,
              request: 55.366983,
              charge: 1.590477,
              limit: 97.322967,
              delta_value: 61.6518,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'monitoring',
          values: [
            {
              date: '2018-11-26',
              project: 'monitoring',
              usage: 30.393888,
              request: 44.040213,
              charge: 1.166445,
              limit: 18.496905,
              delta_value: 30.393888,
              delta_percent: 0.0,
            },
          ],
        },
      ],
    },
    {
      date: '2018-11-27',
      projects: [
        {
          project: 'metering-koku',
          values: [
            {
              date: '2018-11-27',
              project: 'metering-koku',
              usage: 67.362057,
              request: 86.384844,
              charge: 2.073225,
              limit: 119.414988,
              delta_value: 67.362057,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'monitoring',
          values: [
            {
              date: '2018-11-27',
              project: 'monitoring',
              usage: 30.761703,
              request: 44.040213,
              charge: 1.181775,
              limit: 18.496905,
              delta_value: 30.761703,
              delta_percent: 0.0,
            },
          ],
        },
      ],
    },
    {
      date: '2018-11-28',
      projects: [
        {
          project: 'metering-koku',
          values: [
            {
              date: '2018-11-28',
              project: 'metering-koku',
              usage: 70.74081,
              request: 86.384844,
              charge: 2.073225,
              limit: 119.414988,
              delta_value: 70.74081,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'monitoring',
          values: [
            {
              date: '2018-11-28',
              project: 'monitoring',
              usage: 31.165344,
              request: 44.040213,
              charge: 1.195488,
              limit: 18.496905,
              delta_value: 31.165344,
              delta_percent: 0.0,
            },
          ],
        },
      ],
    },
    {
      date: '2018-11-29',
      projects: [
        {
          project: 'metering-koku',
          values: [
            {
              date: '2018-11-29',
              project: 'metering-koku',
              usage: 47.597606,
              request: 57.589896,
              charge: 1.38215,
              limit: 79.609992,
              delta_value: 47.597606,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'monitoring',
          values: [
            {
              date: '2018-11-29',
              project: 'monitoring',
              usage: 20.560932,
              request: 29.360142,
              charge: 0.78974,
              limit: 12.33127,
              delta_value: 20.560932,
              delta_percent: 0.0,
            },
          ],
        },
      ],
    },
    {
      date: '2018-11-30',
      projects: [
        {
          project: 'metering-koku',
          values: [
            {
              date: '2018-11-30',
              project: 'metering-koku',
              usage: 3.417105,
              request: 4.113564,
              charge: 0.098725,
              limit: 5.686428,
              delta_value: 3.417105,
              delta_percent: 0.0,
            },
          ],
        },
        {
          project: 'monitoring',
          values: [
            {
              date: '2018-11-30',
              project: 'monitoring',
              usage: 1.460651,
              request: 2.097153,
              charge: 0.056097,
              limit: 0.880805,
              delta_value: 1.460651,
              delta_percent: 0.0,
            },
          ],
        },
      ],
    },
  ],
  total: {
    usage: 720.419149,
    request: 911.887125,
    charge: 23.079542,
    limit: 628.696608,
  },
};
