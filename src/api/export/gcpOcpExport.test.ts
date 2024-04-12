import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './gcpOcpExport';

test('runExport API request for GCP on OCP export', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/openshift/infrastructures/gcp/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
