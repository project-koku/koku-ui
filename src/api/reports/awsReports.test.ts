jest.mock('axios');

import axios from 'axios';
import { AwsReportType, runReport } from './awsReports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(AwsReportType.cost, query);
  expect(axios.get).toBeCalledWith(`reports/aws/costs/?${query}`);
});
