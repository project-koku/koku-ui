jest.mock('axios');

import axios from 'axios';
import { AzureReportType, runReport } from './azureReports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(AzureReportType.cost, query);
  expect(axios.get).toBeCalledWith(`reports/aws/costs/?${query}`);
});
