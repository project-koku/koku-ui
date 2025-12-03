import axiosInstance from '../api';
import { ReportType } from '../reports/report';

import { runExport } from './awsExport';

test('runExport API request for AWS', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('reports/aws/costs/?', { headers: { Accept: 'text/csv' } });
});
