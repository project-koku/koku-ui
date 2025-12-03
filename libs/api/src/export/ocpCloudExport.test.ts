import axiosInstance from '../api';
import { ReportType } from '../reports/report';

import { runExport } from './ocpCloudExport';

test('runExport API request for all cloud filtered by OCP', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('reports/openshift/infrastructures/all/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
