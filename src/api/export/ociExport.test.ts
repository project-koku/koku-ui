import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runExport } from './ociExport';

test('runExport API request for OCI', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toBeCalledWith('reports/oci/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
