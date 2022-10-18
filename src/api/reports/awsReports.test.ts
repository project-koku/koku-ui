import axios from 'axios';

import { runReport } from './awsReports';
import { ReportType } from './report';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(ReportType.storage, query);
  expect(axios.get).toBeCalledWith(`reports/aws/storage/?${query}`);
});
