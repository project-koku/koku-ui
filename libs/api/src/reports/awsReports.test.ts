import axiosInstance from '../api';

import { runReport } from './awsReports';
import { ReportType } from './report';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(ReportType.storage, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`reports/aws/storage/?${query}`);
});
