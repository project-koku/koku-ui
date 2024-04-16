import { axiosInstance } from 'api';
import { ReportType } from 'api/reports/report';

import { runReport } from './rhelReports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(ReportType.cost, query);
  expect(axiosInstance.get).toBeCalledWith(`reports/openshift/costs/?${query}`);
});
