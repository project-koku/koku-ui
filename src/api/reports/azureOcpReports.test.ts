import axios from 'axios';

import { runReport } from './azureOcpReports';
import { ReportType } from './report';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(ReportType.cost, query);
  expect(axios.get).toBeCalledWith(`reports/openshift/infrastructures/azure/costs/?${query}`);
});
