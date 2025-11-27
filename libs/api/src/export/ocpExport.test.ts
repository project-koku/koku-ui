import axiosInstance from '../api';
import { ReportType } from '../reports/report';

import { runExport } from './ocpExport';

test('runExport API request for OCP', () => {
  runExport(ReportType.cost, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('reports/openshift/costs/?', {
    headers: { Accept: 'text/csv' },
  });
});
