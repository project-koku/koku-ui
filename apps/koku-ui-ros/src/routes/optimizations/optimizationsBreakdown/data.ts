/**
 * A copy of the actual API response can be found here https://drive.google.com/file/d/1VAX8sdwUhDlr7RnALAcHT2FBlKa2X3qW/view
 * The format changes are referred from here https://docs.google.com/document/d/1Wyb4Jo5l4KVitooEuZ1BmYMzlmk3VEUAY0DUuMwIwcY/edit
 */

export const data = {
  data: [
    {
      cluster_alias: 'name222',
      cluster_uuid: '222',
      container: 'Yuptoo-service',
      id: '3b55b8f2-fad9-48a7-9598-6ea3a0675546',
      last_reported: '2023-12-08T13:09:29+05:30',
      project: 'Yuptoo-prod',
      recommendations: {
        notifications: {
          '111101': {
            code: 111101,
            message: 'Short Term Recommendations Available',
            type: 'info',
          },
          '111102': {
            code: 111102,
            message: 'Medium Term Recommendations Available',
            type: 'info',
          },
          '111103': {
            code: 111103,
            message: 'Long Term Recommendations Available',
            type: 'info',
          },
        },
        monitoring_end_time: '2024-01-21T00:00:00.000Z',
        current: {
          requests: {
            memory: {
              amount: 50.21,
              format: 'MiB',
            },
            cpu: {
              amount: 1.1,
              format: 'cores',
            },
          },
          limits: {
            memory: {
              amount: 100.0,
              format: 'MiB',
            },
            cpu: {
              amount: 0.5,
              format: 'cores',
            },
          },
        },
        recommendation_terms: {
          short_term: {
            duration_in_hours: 24.0,
            notifications: {
              '112101': {
                code: 112101,
                message: 'Cost Recommendations Available',
                type: 'info',
              },
              '112102': {
                code: 112102,
                message: 'Performance Recommendations Available',
                type: 'info',
              },
            },
            monitoring_start_time: '2024-01-20T00:00:00.000Z',
            recommendation_engines: {
              cost: {
                pods_count: 7,
                confidence_level: 0.0,
                config: {
                  requests: {
                    memory: {
                      amount: 50,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 5,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 60,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 7,
                      format: 'cores',
                    },
                  },
                },
                variation: {
                  requests: {
                    memory: {
                      amount: 187.98999999999998,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: -0.17000000000000015,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 138.2,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 0.42999999999999994,
                      format: 'cores',
                    },
                  },
                },
                // notifications: {},
              },
              performance: {
                pods_count: 7,
                confidence_level: 0.0,
                config: {
                  requests: {
                    memory: {
                      amount: 60,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 4,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 70,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 5,
                      format: 'cores',
                    },
                  },
                },
                variation: {
                  requests: {
                    memory: {
                      amount: 187.98999999999998,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: -0.17000000000000015,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 138.2,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 0.42999999999999994,
                      format: 'cores',
                    },
                  },
                },
                // notifications: {},
              },
            },
            plots: {
              datapoints: 4,
              plots_data: {
                '2024-01-20T12:00:00.000Z': {
                  // cpuUsage: {
                  //   min: 0.0,
                  //   q1: 2.5,
                  //   median: 5.0,
                  //   q3: 7.5,
                  //   max: 10.0,
                  //   format: 'cores',
                  // },
                  // memoryUsage: {
                  //   min: 0.0,
                  //   q1: 25.0,
                  //   median: 50.0,
                  //   q3: 75.0,
                  //   max: 100.0,
                  //   format: 'MiB',
                  // },
                },
                '2024-01-20T06:00:00.000Z': {
                  cpuUsage: {
                    min: 0.05,
                    q1: 0.05,
                    median: 0.05,
                    q3: 0.05,
                    max: 0.05,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 40,
                    q1: 40,
                    median: 40,
                    q3: 40,
                    max: 40,
                    format: 'MiB',
                  },
                },
                '2024-01-20T18:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-21T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.05,
                    q1: 0.05,
                    median: 0.05,
                    q3: 0.05,
                    max: 0.05,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 40,
                    q1: 40,
                    median: 40,
                    q3: 40,
                    max: 40,
                    format: 'MiB',
                  },
                },
              },
            },
          },
          medium_term: {
            duration_in_hours: 168.0,
            notifications: {
              '112101': {
                code: 112101,
                message: 'Cost Recommendations Available',
                type: 'info',
              },
              '112102': {
                code: 112102,
                message: 'Performance Recommendations Available',
                type: 'info',
              },
            },
            monitoring_start_time: '2024-01-14T00:00:00.000Z',
            recommendation_engines: {
              cost: {
                pods_count: 7,
                confidence_level: 0.0,
                config: {
                  requests: {
                    memory: {
                      amount: 60,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 6,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 70,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 7,
                      format: 'cores',
                    },
                  },
                },
                variation: {
                  requests: {
                    memory: {
                      amount: 187.98999999999998,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: -0.17000000000000015,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 138.2,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 0.42999999999999994,
                      format: 'cores',
                    },
                  },
                },
                // notifications: {},
              },
              performance: {
                pods_count: 7,
                confidence_level: 0.0,
                config: {
                  requests: {
                    memory: {
                      amount: 70,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 5,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 80,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 6,
                      format: 'cores',
                    },
                  },
                },
                variation: {
                  requests: {
                    memory: {
                      amount: 187.98999999999998,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: -0.17000000000000015,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 138.2,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 0.42999999999999994,
                      format: 'cores',
                    },
                  },
                },
                notifications: {
                  '323004': {
                    code: 323004,
                    message: 'Workload is optimised wrt CPU REQUESTS, no changes needed',
                    type: 'notice',
                  },
                  '323005': {
                    code: 323005,
                    message: 'Workload is optimised wrt CPU LIMITS, no changes needed',
                    type: 'notice',
                  },
                  '324003': {
                    code: 324003,
                    message: 'Workload is optimised wrt MEMORY REQUESTS, no changes needed',
                    type: 'notice',
                  },
                  '324004': {
                    code: 324004,
                    message: 'Workload is optimised wrt MEMORY LIMITS, no changes needed',
                    type: 'notice',
                  },
                },
              },
            },
            plots: {
              datapoints: 7,
              plots_data: {
                '2024-01-14T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-15T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-16T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-17T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-18T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-19T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-20T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
              },
            },
          },
          long_term: {
            duration_in_hours: 360.0,
            notifications: {
              '112101': {
                type: 'info',
                message: 'Cost Recommendations Available',
                code: 112101,
              },
              '112102': {
                type: 'info',
                message: 'Performance Recommendations Available',
                code: 112102,
              },
            },
            monitoring_start_time: '2024-01-06T00:00:00.000Z',
            recommendation_engines: {
              cost: {
                pods_count: 7,
                confidence_level: 0.0,
                config: {
                  requests: {
                    memory: {
                      amount: 70,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 8,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 80,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 9,
                      format: 'cores',
                    },
                  },
                },
                variation: {
                  requests: {
                    memory: {
                      amount: 187.98999999999998,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: -0.17000000000000015,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 138.2,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 0.42999999999999994,
                      format: 'cores',
                    },
                  },
                },
                // notifications: {},
              },
              performance: {
                pods_count: 7,
                confidence_level: 0.0,
                config: {
                  requests: {
                    memory: {
                      amount: 80,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 7,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 90,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 8,
                      format: 'cores',
                    },
                  },
                },
                variation: {
                  requests: {
                    memory: {
                      amount: 187.98999999999998,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: -0.17000000000000015,
                      format: 'cores',
                    },
                  },
                  limits: {
                    memory: {
                      amount: 138.2,
                      format: 'MiB',
                    },
                    cpu: {
                      amount: 0.42999999999999994,
                      format: 'cores',
                    },
                  },
                },
                notifications: {
                  '323004': {
                    code: 323004,
                    message: 'Workload is optimised wrt CPU REQUESTS, no changes needed',
                    type: 'notice',
                  },
                  '323005': {
                    code: 323005,
                    message: 'Workload is optimised wrt CPU LIMITS, no changes needed',
                    type: 'notice',
                  },
                },
              },
            },
            plots: {
              datapoints: 15,
              plots_data: {
                '2024-01-14T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-15T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-16T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-17T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-18T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-19T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-20T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-21T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-22T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-23T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-24T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-25T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-26T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-27T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
                '2024-01-28T00:00:00.000Z': {
                  cpuUsage: {
                    min: 0.0,
                    q1: 2.5,
                    median: 5.0,
                    q3: 7.5,
                    max: 10.0,
                    format: 'cores',
                  },
                  memoryUsage: {
                    min: 0.0,
                    q1: 25.0,
                    median: 50.0,
                    q3: 75.0,
                    max: 100.0,
                    format: 'MiB',
                  },
                },
              },
            },
          },
        },
      },
      source_id: '111',
      workload: 'Yuptoo-app',
      workload_type: 'replicaset',
    },
  ],
  meta: {
    count: 1,
    limit: 10,
    offset: 0,
  },
  links: {
    first: '/api/cost-management/v1/recommendations/openshift?limit=10&offset=0&start_date=1970-01-01',
    last: '/api/cost-management/v1/recommendations/openshift?limit=10&offset=10&start_date=1970-01-01',
  },
};
