import axiosInstance from '../api';
import { ReportType } from '../reports/report';

import { runExport } from './azureOcpExport';

test('runExport API request for OCP on Azure', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('reports/openshift/infrastructures/azure/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
