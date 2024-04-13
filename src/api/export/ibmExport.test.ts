import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './ibmExport';

test('runExport API request for IBM', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/gcp/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
