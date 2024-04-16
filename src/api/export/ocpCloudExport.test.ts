import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './ocpCloudExport';

test('runExport API request for all cloud filtered by OCP', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/openshift/infrastructures/all/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
