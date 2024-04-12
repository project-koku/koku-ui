import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './ocpExport';

test('runExport API request for OCP export', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/openshift/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
