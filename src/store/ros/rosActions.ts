import type { RosReport, RosType } from 'api/ros/ros';
import { RosPathsType } from 'api/ros/ros';
import { runRosReport } from 'api/ros/rosUtils';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './rosCommon';
import { selectRos, selectRosFetchStatus } from './rosSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface RosActionMeta {
  fetchId: string;
}

export const fetchRosRequest = createAction('ros/request')<RosActionMeta>();
export const fetchRosSuccess = createAction('ros/success')<RosReport, RosActionMeta>();
export const fetchRosFailure = createAction('ros/failure')<AxiosError, RosActionMeta>();

export function fetchRosReport(rosPathsType: RosPathsType, rosType: RosType, rosQueryString: string): ThunkAction {
  return (dispatch, getState) => {
    if (!isRosExpired(getState(), rosPathsType, rosType, rosQueryString)) {
      return;
    }

    const meta: RosActionMeta = {
      fetchId: getFetchId(rosPathsType, rosType, rosQueryString),
    };

    dispatch(fetchRosRequest(meta));
    runRosReport(rosPathsType, rosType, rosQueryString)
      .then(res => {
        dispatch(fetchRosSuccess(res.data, meta));
      })
      .catch(err => {
        // Todo: Remove when API is available
        // dispatch(fetchRosFailure(err, meta));

        const res: any = {
          id: 1,
          cluster_uuid: 'f0501829-e2bc-4ef0-9b4d-2875344c5ac8',
          cluster_alias: '6678',
          project: 'proj_rxu',
          workload: 'deployment_proj_rxu',
          workload_type: 'replicaset',
          container: 'postgres',
          last_reported: '2023-03-29T10:54:45+05:30',
          recommendations: {
            short_term: {
              monitoring_start_time: '2022-01-22T18:25:43.511Z',
              monitoring_end_time: '2022-01-23T18:25:43.511Z',
              duration_in_hours: '24',
              confidence_level: 0.0,
              config: {
                limits: {
                  memory: {
                    amount: 128.8,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: 8.0,
                    format: 'cores',
                  },
                },
                requests: {
                  memory: {
                    amount: 100.0,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: 4.0,
                    format: 'cores',
                  },
                },
              },
              variation: {
                limits: {
                  memory: {
                    amount: 21.2,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: 0,
                    format: 'cores',
                  },
                },
                requests: {
                  memory: {
                    amount: -15.1,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: -3.2,
                    format: 'cores',
                  },
                },
              },
            },
            medium_term: {
              monitoring_start_time: '2022-01-16T18:25:43.511Z',
              monitoring_end_time: '2022-01-23T18:25:43.511Z',
              duration_in_hours: '168',
              confidence_level: 0.0,
              config: {
                limits: {
                  memory: {
                    amount: 18.0,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: 1.0,
                    format: 'cores',
                  },
                },
                requests: {
                  memory: {
                    amount: 60.0,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: 3.0,
                    format: 'cores',
                  },
                },
              },
              variation: {
                limits: {
                  memory: {
                    amount: -2.2,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: -1.1,
                    format: 'cores',
                  },
                },
                requests: {
                  memory: {
                    amount: -2.4,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: -3.3,
                    format: 'cores',
                  },
                },
              },
            },
            long_term: {
              monitoring_start_time: '2022-01-8T18:25:43.511Z',
              monitoring_end_time: '2022-01-23T18:25:43.511Z',
              duration_in_hours: '360',
              confidence_level: 0.0,
              config: {
                limits: {
                  memory: {
                    amount: 28.8,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: 6.0,
                    format: 'cores',
                  },
                },
                requests: {
                  memory: {
                    amount: 80.0,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: 2.0,
                    format: 'cores',
                  },
                },
              },
              variation: {
                limits: {
                  memory: {
                    amount: -1.2,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: -12.2,
                    format: 'cores',
                  },
                },
                requests: {
                  memory: {
                    amount: -1.2,
                    format: 'MiB',
                  },
                  cpu: {
                    amount: -1.2,
                    format: 'cores',
                  },
                },
              },
            },
          },
        };
        const resList: any = {
          data: [{ ...res }],
          meta: {
            count: 1,
            limit: 10,
            offset: 0,
          },
          links: {
            first: 'string',
            last: 'string',
          },
        };
        dispatch(fetchRosSuccess(rosPathsType === RosPathsType.recommendation ? resList : res, meta));
      });
  };
}

function isRosExpired(state: RootState, rosPathsType: RosPathsType, rosType: RosType, rosQueryString: string) {
  const ros = selectRos(state, rosPathsType, rosType, rosQueryString);
  const fetchStatus = selectRosFetchStatus(state, rosPathsType, rosType, rosQueryString);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!ros) {
    return true;
  }

  const now = Date.now();
  return now > ros.timeRequested + expirationMS;
}
