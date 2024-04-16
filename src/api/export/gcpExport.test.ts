import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './gcpExport';

test('runExport API request for GCP', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/gcp/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
