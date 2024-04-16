import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './awsExport';

test('runExport API request for AWS', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/aws/costs/?', { headers: { Accept: 'text/csv' } });
});
