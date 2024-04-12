import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './rhelExport';

test('runExport API request for RHEL export', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/openshift/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
