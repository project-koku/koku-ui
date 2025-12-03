import axiosInstance from '../api';
import { ReportType } from '../reports/report';

import { runExport } from './azureExport';

test('runExport API request for Azure', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('reports/azure/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
