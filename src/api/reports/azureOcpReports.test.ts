import { axiosInstance } from 'api';

import { runReport } from './azureOcpReports';
import { ReportType } from './report';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(ReportType.cost, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`reports/openshift/infrastructures/azure/costs/?${query}`);
});
