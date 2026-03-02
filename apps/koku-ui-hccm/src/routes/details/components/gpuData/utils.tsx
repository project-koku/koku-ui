import type { OcpQuery } from 'api/queries/ocpQuery';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { OcpReport } from 'api/reports/ocpReports';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import { useIsMigToggleEnabled } from 'components/featureToggle';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { useQueryFromRoute, useQueryState } from 'utils/hooks';
import { platformCategoryKey } from 'utils/props';

export interface GpuStateProps {
  isMigToggleEnabled?: boolean;
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface GpuMapProps {
  query?: OcpQuery;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

export const useMapToProps = ({ query, reportPathsType, reportType }: GpuMapProps): GpuStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();
  const queryState = useQueryState();

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  const isFilterByExact = groupBy && groupByValue !== '*';
  const timeScopeValue = getTimeScopeValue(queryState);

  const reportQuery: Query = {
    filter: {
      ...query.filter,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: timeScopeValue,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
      // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      // Note: We're not inserting PVC information for the 'Platform' project
      ...(isFilterByExact && {
        [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
        [`exact:${groupBy}`]: groupByValue,
      }),
      ...query.filter_by,
    },
    exclude: {
      ...(queryState?.exclude && queryState.exclude),
    },
    group_by: {
      gpu_name: '*',
    },
    order_by: query.order_by,
  };

  const reportQueryString = getQuery(reportQuery);
  let report = useSelector((state: RootState) =>
    reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString)
  );
  const reportFetchStatus = useSelector((state: RootState) =>
    reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, reportQueryString)
  );
  const reportError = useSelector((state: RootState) =>
    reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString)
  );

  useEffect(() => {
    if (!reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(reportActions.fetchReport(reportPathsType, reportType, reportQueryString));
    }
  }, [dispatch, reportError, reportFetchStatus, reportPathsType, reportQueryString, reportType]);

  const isMigToggleEnabled = useIsMigToggleEnabled();
  if (isMigToggleEnabled) {
    report = {
      meta: {
        count: 4,
        limit: 3,
        offset: 0,
        others: 0,
        currency: 'USD',
        filter: {
          resolution: 'monthly',
          time_scope_value: '-1',
          time_scope_units: 'month',
          limit: 3,
          offset: 0,
          'exact:project': ['Garner'],
        },
        group_by: {
          gpu_name: ['*'],
        },
        order_by: {
          gpu_count: 'desc',
        },
        exclude: {},
        total: {
          infrastructure: {
            raw: {
              value: 0.0,
              units: 'USD',
            },
            markup: {
              value: 0.0,
              units: 'USD',
            },
            usage: {
              value: 0.0,
              units: 'USD',
            },
            total: {
              value: 0.0,
              units: 'USD',
            },
          },
          supplementary: {
            raw: {
              value: 0.0,
              units: 'USD',
            },
            markup: {
              value: 0.0,
              units: 'USD',
            },
            usage: {
              value: 0.0,
              units: 'USD',
            },
            total: {
              value: 0.0,
              units: 'USD',
            },
          },
          cost: {
            raw: {
              value: 0.0,
              units: 'USD',
            },
            markup: {
              value: 0.0,
              units: 'USD',
            },
            usage: {
              value: 0.0,
              units: 'USD',
            },
            total: {
              value: 0.0,
              units: 'USD',
            },
          },
        },
      },
      links: {
        first:
          '/api/cost-management/v1/reports/openshift/gpu/?filter%5Bexact%3Aproject%5D=Garner&filter%5Blimit%5D=3&filter%5Boffset%5D=0&filter%5Bresolution%5D=monthly&filter%5Btime_scope_units%5D=month&filter%5Btime_scope_value%5D=-1&group_by%5Bgpu_name%5D=%2A&order_by%5Bgpu_count%5D=desc',
        next: null,
        previous: null,
        last: '/api/cost-management/v1/reports/openshift/gpu/?filter%5Bexact%3Aproject%5D=Garner&filter%5Blimit%5D=3&filter%5Boffset%5D=0&filter%5Bresolution%5D=monthly&filter%5Btime_scope_units%5D=month&filter%5Btime_scope_value%5D=-1&group_by%5Bgpu_name%5D=%2A&order_by%5Bgpu_count%5D=desc',
      },
      data: [
        {
          date: '2026-02',
          gpu_names: [
            {
              gpu_name: 'nvidia_A100_compute_1',
              values: [
                {
                  date: '2026-02',
                  gpu_name: 'nvidia_A100_compute_1',
                  node: 'compute_7',
                  gpu_model: 'A100',
                  gpu_mode: 'MIG',
                  gpu_vendor: 'nvidia',
                  gpu_memory: {
                    value: 42.94967296,
                    units: 'GB',
                  },
                  gpu_count: {
                    value: 6,
                    units: 'GPUs',
                  },
                  source_uuid: ['021ca3a6-7c82-493f-bb27-8ca9a7a2e46c'],
                  clusters: ['OCP on OpenStack - Nise populator'],
                  infrastructure: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                  supplementary: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                  cost: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          date: '2026-02',
          gpu_names: [
            {
              gpu_name: 'nvidia_A100_compute_2',
              values: [
                {
                  date: '2026-02',
                  gpu_name: 'nvidia_A100_compute_2',
                  node: 'compute_7',
                  gpu_model: 'A100',
                  gpu_mode: 'Dedicated',
                  gpu_vendor: 'nvidia',
                  gpu_memory: {
                    value: 42.94967296,
                    units: 'GB',
                  },
                  gpu_count: {
                    value: 6,
                    units: 'GPUs',
                  },
                  source_uuid: ['021ca3a6-7c82-493f-bb27-8ca9a7a2e46c'],
                  clusters: ['OCP on OpenStack - Nise populator'],
                  infrastructure: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                  supplementary: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                  cost: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          date: '2026-02',
          gpu_names: [
            {
              gpu_name: 'nvidia_A100_compute_3',
              values: [
                {
                  date: '2026-02',
                  gpu_name: 'nvidia_A100_compute_3',
                  node: 'compute_7',
                  gpu_model: 'A100',
                  gpu_mode: 'MIG',
                  gpu_vendor: 'nvidia',
                  gpu_memory: {
                    value: 42.94967296,
                    units: 'GB',
                  },
                  gpu_count: {
                    value: 6,
                    units: 'GPUs',
                  },
                  source_uuid: ['021ca3a6-7c82-493f-bb27-8ca9a7a2e46c'],
                  clusters: ['OCP on OpenStack - Nise populator'],
                  infrastructure: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                  supplementary: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                  cost: {
                    raw: {
                      value: 0.0,
                      units: 'USD',
                    },
                    markup: {
                      value: 0.0,
                      units: 'USD',
                    },
                    usage: {
                      value: 0.0,
                      units: 'USD',
                    },
                    total: {
                      value: 0.0,
                      units: 'USD',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    } as any;
  }

  return {
    isMigToggleEnabled,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};
