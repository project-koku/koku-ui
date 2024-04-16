import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './azureOcpExport';

test('runExport API request for OCP on Azure', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/openshift/infrastructures/azure/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
