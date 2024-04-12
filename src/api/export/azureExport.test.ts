import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './azureExport';

test('runExport API request for Azure export', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/azure/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
