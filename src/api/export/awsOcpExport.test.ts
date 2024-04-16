import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './awsOcpExport';

test('runExport API request for OCP on AWS', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/openshift/infrastructures/aws/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
